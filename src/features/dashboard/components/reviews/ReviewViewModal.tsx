"use client";

import React from "react";
import {
  X,
  Star,
  User,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  Pencil,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Review } from "@/db/schema";

interface ReviewViewModalProps {
  review: Review;
  bookName?: string;
  userName?: string;
  onClose: () => void;
  onEdit: () => void;
  onToggleHide: () => void;
}

export function ReviewViewModal({
  review,
  bookName,
  userName,
  onClose,
  onEdit,
  onToggleHide,
}: ReviewViewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Star className="size-4 fill-amber-500 text-amber-500" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Review Details</h3>
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
          {/* Status & Rating Banner */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Rating Given</p>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4.5 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-sm font-bold text-gray-900 ml-1">
                  {review.rating}.0 / 5
                </span>
              </div>
            </div>

            <div>
              {review.isHidden ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-100">
                  <EyeOff className="size-3.5 text-rose-500" /> Hidden
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> Visible
                </span>
              )}
            </div>
          </div>

          {/* Book and User Reference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <BookOpen className="size-3.5" />
                <span>Book Item</span>
              </div>
              <p className="text-xs font-semibold text-gray-900 truncate">
                {bookName || `Book: ${review.bookId.slice(0, 10)}...`}
              </p>
              <p className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">
                ID: {review.bookId}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <User className="size-3.5" />
                <span>Reviewer</span>
              </div>
              <p className="text-xs font-semibold text-gray-900 truncate">
                {userName || `User: ${review.userId.slice(0, 10)}...`}
              </p>
              <p className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">
                ID: {review.userId}
              </p>
            </div>
          </div>

          {/* Comment Content */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Comment Text
            </h4>
            <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
              {review.comment || (
                <span className="italic text-gray-400">No written text comment provided.</span>
              )}
            </p>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
            <span>Submitted: {new Date(review.createdAt).toLocaleString()}</span>
            <span>ID: {review.id}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={() => {
              onToggleHide();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {review.isHidden ? (
              <>
                <Eye className="size-3.5 text-emerald-600" />
                <span>Publish Review</span>
              </>
            ) : (
              <>
                <EyeOff className="size-3.5 text-amber-600" />
                <span>Hide Review</span>
              </>
            )}
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
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
