"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Plus, Ticket } from "lucide-react";
import { createCouponAction } from "@/features/orders/actions/coupons.actions";

interface CouponCreateModalProps {
  onClose: () => void;
  onCreated: (code: string) => void;
  onError: (errorMsg: string) => void;
}

const createInitial: { error?: string; data?: { id: string } } = {};

export function CouponCreateModal({
  onClose,
  onCreated,
  onError,
}: CouponCreateModalProps) {
  const [state, formAction, isPending] = useActionState(createCouponAction, createInitial);
  const [submitted, setSubmitted] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else if (state.data) {
        onCreated(enteredCode);
        onClose();
      }
    }
  }, [submitted, isPending, state.error, state.data, onCreated, onError, onClose, enteredCode]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    const code = fd.get("code")?.toString().toUpperCase() || "";
    setEnteredCode(code);
    fd.set("code", code);
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <Ticket className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add New Coupon</h3>
              <p className="text-xs text-gray-500">Create promotional discount voucher</p>
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
        <form action={handleAction}>
          <div className="p-6 space-y-4">
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#D10A13]">
                {state.error}
              </div>
            )}

            {/* Coupon Code */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Coupon Code *
              </label>
              <input
                name="code"
                required
                placeholder="e.g. EID50, BOOKLIFE10"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-mono uppercase text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Discount Amount */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Discount Amount (৳) *
                </label>
                <input
                  name="discountTaka"
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="50"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Max Uses Limit
                </label>
                <input
                  name="maxUses"
                  type="number"
                  min="1"
                  placeholder="Unlimited if blank"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                />
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Expiration Date & Time
              </label>
              <input
                name="expiresAt"
                type="datetime-local"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            {/* Active Status */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={true}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                />
                <span className="text-xs font-medium text-gray-700">
                  Active immediately (Allow shoppers to redeem)
                </span>
              </label>
            </div>
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Create Coupon</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
