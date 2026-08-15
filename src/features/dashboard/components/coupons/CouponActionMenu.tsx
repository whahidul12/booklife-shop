"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Pencil, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import type { Coupon } from "@/db/schema";

interface CouponActionMenuProps {
  coupon: Coupon;
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onToggleActive: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

export function CouponActionMenu({
  coupon,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: CouponActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Actions"
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-1 w-40 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onView(coupon);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Eye className="size-3.5 text-gray-500" />
            <span>View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(coupon);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Pencil className="size-3.5 text-blue-500" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleActive(coupon);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            {coupon.isActive ? (
              <>
                <ToggleLeft className="size-3.5 text-amber-500" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <ToggleRight className="size-3.5 text-emerald-500" />
                <span>Activate</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(coupon);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#D10A13] hover:bg-red-50 transition-colors"
          >
            <Trash2 className="size-3.5 text-[#D10A13]" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
