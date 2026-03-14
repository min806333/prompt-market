"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";

type Order = {
  id: string;
  created_at: string;
  amount: number;
  payment_status: string;
  product_title?: string;
  product_slug?: string;
  product_image_url?: string;
};

export default function PurchasesClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const toast = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      setFetching(true);
      const { data, error } = await supabase
        .from("completed_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("구매 내역을 불러오지 못했습니다.");
      } else {
        setOrders(data ?? []);
      }
      setFetching(false);
    }
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return null;
  if (!user) return null;

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
          >
            ← 마이페이지
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">구매 내역</h1>
        </div>

        {fetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🛒</p>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              구매 내역이 없습니다
            </h2>
            <p className="text-gray-500 mb-6">첫 프롬프트를 구매해 보세요!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
              >
                {order.product_image_url && (
                  <img
                    src={order.product_image_url}
                    alt={order.product_title ?? ""}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {order.product_title ?? "상품"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("ko-KR")} ·{" "}
                    <span className="font-medium text-brand-600 dark:text-brand-400">
                      ${order.amount.toFixed(2)}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  결제 완료
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
