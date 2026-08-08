"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { useBookDetail } from "../context/BookDetailContext";

const REVIEWS_PER_PAGE = 5;

/* ── Star picker ──────────────────────────────────────────────────── */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} তারা`}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`size-6 ${
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Write review modal ──────────────────────────────────────────── */
function WriteReviewModal({
  bookId,
  onClose,
}: {
  bookId: string;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setError("");
    try {
      const { submitReviewAction } = await import(
        "@/features/reviews/actions/reviews.actions"
      );
      const fd = new FormData();
      fd.set("bookId", bookId);
      fd.set("rating", String(rating));
      fd.set("comment", comment.trim());
      const res = await submitReviewAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
        setTimeout(onClose, 1500);
      }
    } catch {
      setError("রিভিউ জমা দেওয়া যায়নি");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-4 text-base font-bold text-gray-900">
          আপনার রিভিউ লিখুন
        </h3>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6 text-green-600">
            <Star className="size-10 fill-yellow-400 text-yellow-400" />
            <p className="font-semibold">রিভিউ সফলভাবে জমা হয়েছে!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div>
              <label className="mb-1.5 block text-sm text-gray-600">
                রেটিং দিন
              </label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gray-600">
                আপনার মতামত
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                placeholder="বইটি সম্পর্কে আপনার অনুভূতি লিখুন..."
                className="w-full resize-none rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                জমা দিন
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export function ReviewList() {
  const { reviews, book } = useBookDetail();
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

  return (
    <>
      {showModal && (
        <WriteReviewModal bookId={book.id} onClose={() => setShowModal(false)} />
      )}

      {/* Write Review Button */}
      <div className="mt-8 border-t pt-6">
        <button
          onClick={() => setShowModal(true)}
          className="rounded border border-red-600 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          আপনার রিভিউটি লিখুন
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 py-8 text-center text-sm text-gray-400">
          এখনো কোনো রিভিউ নেই। প্রথম রিভিউ লিখুন!
        </div>
      ) : (
        <>
          {/* Reviews List */}
          <div className="mt-6 flex flex-col divide-y divide-gray-100">
            {pageReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  id: 0,
                  rating: review.rating,
                  comment: review.comment,
                  author: `ব্যবহারকারী`,
                  date: new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between border-t pt-4 text-xs text-gray-500">
              <span>
                {start + 1} – {Math.min(start + REVIEWS_PER_PAGE, reviews.length)} of {reviews.length} রিভিউ
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`size-7 rounded text-xs font-medium ${
                      safePage === p
                        ? "bg-red-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
