"use client";

import React, { useState } from "react";
import { X, RefreshCw, CheckSquare, ShoppingBag } from "lucide-react";
import { updateOrderStatusAction } from "@/features/orders/actions/orders.actions";
import type { Order } from "@/db/schema";
import type { OrderStatus } from "./types";

interface OrderEditStatusModalProps {
  order: Order;
  onClose: () => void;
  onSaved: (status: OrderStatus) => void;
  onError: (errorMsg: string) => void;
}

const statusOptions: { value: OrderStatus; label: string; desc: string }[] = [
  { value: "pending", label: "Pending (অপেক্ষমাণ)", desc: "Order placed by customer, awaiting store processing" },
  { value: "confirmed", label: "Confirmed (নিশ্চিত)", desc: "Order verified, packed and ready for dispatch" },
  { value: "shipped", label: "Shipped (ডেলিভারির পথে)", desc: "Handed over to delivery courier partner" },
  { value: "delivered", label: "Delivered (ডেলিভারি সম্পন্ন)", desc: "Customer received the parcel and paid" },
  { value: "cancelled", label: "Cancelled (বাতিল)", desc: "Order cancelled or rejected" },
];

export function OrderEditStatusModal({
  order,
  onClose,
  onSaved,
  onError,
}: OrderEditStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [isPending, setIsPending] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await updateOrderStatusAction(order.id, status);
      if (res.error) {
        onError(res.error);
        setIsPending(false);
      } else {
        onSaved(status);
        onClose();
      }
    } catch {
      onError("Failed to update order status");
      setIsPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <CheckSquare className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Update Order Status</h3>
              <p className="font-mono text-xs text-gray-500">Order #{order.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave}>
          <div className="p-6 space-y-3">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Current Fulfillment Stage:
            </label>

            {statusOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  status === opt.value
                    ? "border-[#D10A13] bg-red-50/30 ring-1 ring-[#D10A13]"
                    : "border-gray-200 bg-white hover:bg-gray-50/70"
                }`}
              >
                <input
                  type="radio"
                  name="orderStatus"
                  value={opt.value}
                  checked={status === opt.value}
                  onChange={() => setStatus(opt.value)}
                  className="mt-0.5 size-4 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900 block">{opt.label}</span>
                  <span className="text-[11px] text-gray-500 block leading-tight">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D10A13] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save New Status</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
