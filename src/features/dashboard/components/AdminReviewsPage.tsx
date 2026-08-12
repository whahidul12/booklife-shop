"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw, Star } from "lucide-react";
import {
  getAllReviewsAction,
  hideReviewAction,
  unhideReviewAction,
} from "@/features/reviews/actions/reviews.actions";
import type { Review } from "@/db/schema";

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAllReviewsAction();
    if (res.data) setReviews(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleHide(review: Review) {
    setActionError(null);
    const res = review.isHidden
      ? await unhideReviewAction(review.id)
      : await hideReviewAction(review.id);
    if (res.error) setActionError(res.error);
    else load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {actionError && <p className="mb-3 text-sm text-red-600">{actionError}</p>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Book</th>
              <th className="px-4 py-3 text-left font-medium">Rating</th>
              <th className="px-4 py-3 text-left font-medium">Comment</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">লোড হচ্ছে...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">কোনো রিভিউ নেই</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className={`hover:bg-gray-50 ${r.isHidden ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[80px] truncate">{r.userId.slice(0, 8)}…</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[80px] truncate">{r.bookId.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{r.comment ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.isHidden ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {r.isHidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleHide(r)}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">
                    {r.isHidden ? <><Eye className="size-3.5" /> Unhide</> : <><EyeOff className="size-3.5" /> Hide</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
