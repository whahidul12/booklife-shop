"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Package, ArrowRight, X } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";
import type { Order } from "@/features/navigation/store/types";

interface OrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  visa: "Visa / Mastercard",
};

export function OrderConfirmationModal({
  order,
  onClose,
}: OrderConfirmationModalProps) {
  const router = useRouter();

  const handleViewOrders = () => {
    onClose();
    router.push("/account/orders");
  };

  const handleContinueShopping = () => {
    onClose();
    router.push("/");
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="size-9 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            অর্ডার সম্পন্ন হয়েছে!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
          </p>
        </div>

        {/* Order details */}
        <div className="mx-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="size-4 text-red-500" />
              <span className="font-medium">অর্ডার নম্বর</span>
            </div>
            <span className="font-bold text-gray-900">{order.id}</span>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">তারিখ</span>
              <span>
                {new Date(order.date).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">পেমেন্ট</span>
              <span>
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">আইটেম</span>
              <span>{toBengaliNumber(order.items.length)} টি বই</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold">
              <span>সর্বমোট</span>
              <span className="text-red-600">
                {toBengaliNumber(order.total)}৳
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="mx-6 mt-3 flex items-center gap-2 rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-700">
          <span className="size-2 rounded-full bg-orange-400 animate-pulse" />
          অর্ডারটি প্রক্রিয়াধীন রয়েছে
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-6 py-6">
          <button
            onClick={handleViewOrders}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            আমার অর্ডার দেখুন
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            কেনাকাটা চালিয়ে যান
          </button>
        </div>
      </div>
    </div>
  );
}
