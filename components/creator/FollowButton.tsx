"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";

interface FollowButtonProps {
  creatorId: string;
  initialFollowing?: boolean;
  initialCount?: number;
  size?: "sm" | "md";
}

export default function FollowButton({
  creatorId,
  initialFollowing = false,
  initialCount = 0,
  size = "md",
}: FollowButtonProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user || initialized) return;
    fetch(`/api/follow?creatorId=${creatorId}`)
      .then((r) => r.json())
      .then((data) => {
        setFollowing(data.following ?? false);
        setCount(data.followerCount ?? initialCount);
        setInitialized(true);
      })
      .catch(() => setInitialized(true));
  }, [user, creatorId, initialized, initialCount]);

  async function handleToggle() {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    if (loading) return;

    setLoading(true);
    // Optimistic update
    setFollowing((prev) => !prev);
    setCount((prev) => (following ? prev - 1 : prev + 1));

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Revert
        setFollowing(following);
        setCount(count);
        toast.error(data.error ?? "오류가 발생했습니다.");
      } else {
        setFollowing(data.following);
        toast.success(data.following ? "팔로우했습니다." : "팔로우를 취소했습니다.");
      }
    } catch {
      setFollowing(following);
      setCount(count);
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : "px-5 py-2 text-sm";

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-60 ${sizeClasses} ${
        following
          ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {following ? (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16 11a5 5 0 01-9.9 0H16z" />
          </svg>
          팔로잉
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          팔로우
        </>
      )}
      {count > 0 && (
        <span className={`${following ? "text-gray-500" : "text-indigo-200"} font-normal`}>
          {count}
        </span>
      )}
    </button>
  );
}
