"use client";

import React, { useState } from "react";
import {
  X,
  Ticket,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Pencil,
  Clock,
  Layers,
} from "lucide-react";
import type { Coupon } from "@/db/schema";

interface CouponViewModalProps {
  coupon: Coupon;
  onClose: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
}

export function CouponViewModal({
  coupon,
  onClose,
  onEdit,
  onToggleActive,
}: CouponViewModalProps) {
  const [copied, setCopied] = useState(false);

  const discountAmount = (coupon.discountPaisa / 100).toFixed(0);
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  const isMaxedOut = coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;

  const copyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#D10A13]">
              <Ticket className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Coupon Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Coupon Code Hero Display */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 p-6 text-center">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black tracking-widest text-[#D10A13]">
                {coupon.code}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-lg bg-white p-1.5 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-[#D10A13] transition-colors"
                title="Copy Coupon Code"
              >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>
            </div>
            <p className="text-xs font-semibold text-gray-700 mt-2">
              Provides Flat ৳ {discountAmount} Discount on checkout orders
            </p>
          </div>

          {/* Status Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {coupon.isActive && !isExpired && !isMaxedOut ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="size-3.5" /> Active & Ready to Redeem
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-100">
                <Clock className="size-3.5" /> Expired Campaign
              </span>
            ) : isMaxedOut ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                <Layers className="size-3.5" /> Maximum Uses Reached
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-100">
                <XCircle className="size-3.5" /> Inactive / Paused
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Discount Amount</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">৳ {discountAmount}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Times Redeemed</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                {coupon.usedCount}{" "}
                <span className="text-xs font-normal text-gray-500">
                  {coupon.maxUses ? `/ ${coupon.maxUses} max` : "(Unlimited)"}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Expiration Date</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {coupon.expiresAt
                  ? new Date(coupon.expiresAt).toLocaleDateString()
                  : "No Expiration Date"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Date Created</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {new Date(coupon.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={() => {
              onToggleActive();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all"
            >
              <Pencil className="size-3.5" />
              <span>Edit Coupon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
