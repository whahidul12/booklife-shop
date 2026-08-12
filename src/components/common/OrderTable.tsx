"use client";

import { useEffect, useState } from "react";
import { Package, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getMyOrdersAction, cancelMyOrderAction } from "@/features/orders/actions/orders.actions";
import type { Order } from "@/db/schema";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  shipped: "শিপড",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল",
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: "বাকি",
  success: "সম্পন্ন",
  failed: "ব্যর্থ",
};

const CANCELLABLE = new Set(["pending", "confirmed"]);

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await getMyOrdersAction();
    if (res.error) setError(res.error);
    else setOrders(res.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCancel(orderId: string) {
    setCancellingId(orderId);
    const res = await cancelMyOrderAction(orderId);
    if (res.error) setError(res.error);
    else load();
    setCancellingId(null);
  }

  if (loading) {
    return (
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">My Orders</h2>
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          <RefreshCw className="mr-2 size-4 animate-spin" /> লোড হচ্ছে...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">My Orders</h2>
        {error && (
          <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="mb-4 size-14 text-gray-300" />
          <p className="text-base font-medium text-gray-500">
            এখনো কোনো অর্ডার করা হয়নি
          </p>
          <p className="mt-1 text-sm text-gray-400">
            কেনাকাটা শুরু করলে অর্ডার এখানে দেখা যাবে।
          </p>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            কেনাকাটা করুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          My Orders{" "}
          <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            {orders.length}
          </span>
        </h2>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-3.5" /> রিফ্রেশ
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">অর্ডার নম্বর</th>
              <th className="px-4 py-3 font-medium">তারিখ</th>
              <th className="px-4 py-3 font-medium">পেমেন্ট</th>
              <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
              <th className="px-4 py-3 text-right font-medium">মোট</th>
              <th className="px-4 py-3 text-right font-medium">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-gray-50">
                {/* Order ID */}
                <td className="px-4 py-4 font-mono text-xs font-semibold text-gray-800">
                  {order.id}
                </td>

                {/* Date */}
                <td className="px-4 py-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Payment status */}
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-500">
                    {PAYMENT_LABELS[order.paymentStatus] ?? order.paymentStatus}
                  </span>
                </td>

                {/* Order status */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>

                {/* Total */}
                <td className="px-4 py-4 text-right font-semibold text-gray-900">
                  {Math.round(order.totalPaisa / 100)}৳
                </td>

                {/* Cancel action */}
                <td className="px-4 py-4 text-right">
                  {CANCELLABLE.has(order.status) ? (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="size-3.5" />
                      {cancellingId === order.id ? "বাতিল হচ্ছে..." : "বাতিল করুন"}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
