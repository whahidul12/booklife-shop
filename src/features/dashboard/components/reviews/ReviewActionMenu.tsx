"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Review } from "@/db/schema";

interface ReviewActionMenuProps {
  review: Review;
  onView: (review: Review) => void;
  onEdit: (review: Review) => void;
  onToggleHide: (review: Review) => void;
  onDelete: (review: Review) => void;
}

export function ReviewActionMenu({
  review,
  onView,
  onEdit,
  onToggleHide,
  onDelete,
}: ReviewActionMenuProps) {
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
              onView(review);
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
              onEdit(review);
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
              onToggleHide(review);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            {review.isHidden ? (
              <>
                <Eye className="size-3.5 text-emerald-500" />
                <span>Publish</span>
              </>
            ) : (
              <>
                <EyeOff className="size-3.5 text-amber-500" />
                <span>Hide</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(review);
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
