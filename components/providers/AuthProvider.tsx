"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  subscriptionStatus: "free",
  trialEndsAt: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("role, subscription_status, trial_ends_at")
      .eq("id", userId)
      .single();

    if (!data) return;

    setIsAdmin(data.role === "admin");

    const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
    const isTrialActive = trialEnd && trialEnd > new Date();

    if (data.subscription_status === "pro" && trialEnd && !isTrialActive) {
      await supabase
        .from("profiles")
        .update({ subscription_status: "free" })
        .eq("id", userId);
      setSubscriptionStatus("free");
    } else {
      setSubscriptionStatus(data.subscription_status ?? "free");
    }

    setTrialEndsAt(data.trial_ends_at ?? null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsAdmin(false);
        setSubscriptionStatus("free");
        setTrialEndsAt(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSubscriptionStatus("free");
    setTrialEndsAt(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, subscriptionStatus, trialEndsAt, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
