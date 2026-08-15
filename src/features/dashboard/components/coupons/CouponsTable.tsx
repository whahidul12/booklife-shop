"use client";

import React, { useState } from "react";
import { Ticket, Copy, Check, ChevronDown, CheckCircle2, Clock, XCircle, Layers } from "lucide-react";
import type { Coupon } from "@/db/schema";
import { CouponActionMenu } from "./CouponActionMenu";

interface CouponsTableProps {
  coupons: Coupon[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewCoupon: (coupon: Coupon) => void;
  onEditCoupon: (coupon: Coupon) => void;
  onToggleActiveCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (coupon: Coupon) => void;
}

export function CouponsTable({
  coupons,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewCoupon,
  onEditCoupon,
  onToggleActiveCoupon,
  onDeleteCoupon,
}: CouponsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allSelected = coupons.length > 0 && selectedIds.length === coupons.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < coupons.length;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-semibold text-gray-600">Coupon Code</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Discount (৳)</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Redemptions</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Expires</th>
              <th className="px-4 py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ChevronDown className="size-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Ticket className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No coupons found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query, status, or date range filters.
                  </p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const isSelected = selectedIds.includes(coupon.id);
                const discount = (coupon.discountPaisa / 100).toFixed(0);
                const isExpired =
                  coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const isMaxed =
                  coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;

                let statusBadge;
                if (!coupon.isActive) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                      <XCircle className="size-3" /> Inactive
                    </span>
                  );
                } else if (isExpired) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-100">
                      <Clock className="size-3" /> Expired
                    </span>
                  );
                } else if (isMaxed) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-100">
                      <Layers className="size-3" /> Maxed Out
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="size-3" /> Active
                    </span>
                  );
                }

                return (
                  <tr
                    key={coupon.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(coupon.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => onViewCoupon(coupon)}
                          className="font-mono font-bold text-xs text-gray-900 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-[#D10A13] hover:text-[#D10A13] cursor-pointer transition-colors"
                        >
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(coupon.code, coupon.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title="Copy Code"
                        >
                          {copiedId === coupon.id ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3.5 font-semibold text-gray-900 text-xs">
                      ৳ {discount}
                    </td>

                    {/* Uses */}
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      <span className="font-medium text-gray-800">
                        {coupon.usedCount}
                      </span>{" "}
                      {coupon.maxUses !== null ? (
                        <span className="text-gray-400">/ {coupon.maxUses} max</span>
                      ) : (
                        <span className="text-gray-400">(unlimited)</span>
                      )}
                    </td>

                    {/* Expires */}
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {coupon.expiresAt ? (
                        <span className={isExpired ? "text-amber-600 font-medium" : ""}>
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No Expiry</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">{statusBadge}</td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <CouponActionMenu
                        coupon={coupon}
                        onView={onViewCoupon}
                        onEdit={onEditCoupon}
                        onToggleActive={onToggleActiveCoupon}
                        onDelete={onDeleteCoupon}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
