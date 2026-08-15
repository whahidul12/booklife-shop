"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Plus, Star, MessageSquarePlus } from "lucide-react";
import { submitReviewAction } from "@/features/reviews/actions/reviews.actions";
import type { Book } from "@/db/schema";

interface ReviewCreateModalProps {
  books: Book[];
  onClose: () => void;
  onCreated: () => void;
  onError: (errorMsg: string) => void;
}

const createInitial: { error?: string; data?: { id: string } } = {};

export function ReviewCreateModal({
  books,
  onClose,
  onCreated,
  onError,
}: ReviewCreateModalProps) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, createInitial);
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else if (state.data) {
        onCreated();
        onClose();
      }
    }
  }, [submitted, isPending, state.error, state.data, onCreated, onError, onClose]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    fd.set("rating", String(rating));
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
              <MessageSquarePlus className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add Customer Review</h3>
              <p className="text-xs text-gray-500">
                Record customer rating and feedback
              </p>
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
          <div className="p-6 space-y-5">
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#D10A13]">
                {state.error}
              </div>
            )}

            {/* Select Book */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Book / Product *
              </label>
              <select
                name="bookId"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              >
                <option value="">-- Select Book --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Stars Selection */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`size-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-gray-700">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Customer Comment
              </label>
              <textarea
                name="comment"
                rows={4}
                placeholder="Write customer feedback or review comment here..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
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
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
