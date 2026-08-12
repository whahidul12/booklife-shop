"use client";

import { useEffect, useState } from "react";
import { Star, RefreshCw } from "lucide-react";
import Image from "next/image";

interface MyReview {
  id: string;
  bookId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

async function getMyReviewsFromDB(): Promise<MyReview[]> {
  // Dynamically import to keep server-only code out of the client bundle
  const { getMyReviewsAction } = await import(
    "@/features/reviews/actions/reviews.actions"
  );
  const res = await getMyReviewsAction();
  if (res.error || !res.data) return [];
  return res.data as MyReview[];
}

export function ReviewsPanel() {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reviewed" | "pending">("reviewed");

  useEffect(() => {
    setLoading(true);
    getMyReviewsFromDB()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Reviews</h2>
        <button
          onClick={() => {
            setLoading(true);
            getMyReviewsFromDB()
              .then(setReviews)
              .finally(() => setLoading(false));
          }}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-3.5" /> রিফ্রেশ
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab("pending")}
          className={`border-b-2 px-4 py-2 transition-colors ${activeTab === "pending"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Not Reviewed (0)
        </button>
        <button
          onClick={() => setActiveTab("reviewed")}
          className={`border-b-2 px-4 py-2 transition-colors ${activeTab === "reviewed"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Reviewed ({loading ? "..." : reviews.length})
        </button>
      </div>

      {/* Pending tab */}
      {activeTab === "pending" && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Star className="mb-4 size-14 fill-gray-200 text-gray-300" />
          <h3 className="mb-1 text-base font-semibold text-gray-800">
            কোনো পণ্য রিভিউ করার নেই
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            আপনি এখনো কোনো পেইড পণ্য কিনেননি।
          </p>
        </div>
      )}

      {/* Reviewed tab */}
      {activeTab === "reviewed" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
              <RefreshCw className="size-4 animate-spin" /> লোড হচ্ছে...
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="mb-4 size-14 fill-gray-200 text-gray-300" />
              <h3 className="mb-1 text-base font-semibold text-gray-800">
                কোনো রিভিউ নেই
              </h3>
              <p className="max-w-sm text-sm text-gray-500">
                বইয়ের পাতায় গিয়ে রিভিউ লিখুন, এখানে দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-xs"
                >
                  {/* Placeholder book cover — real image would need bookId→image join */}
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                    <Image
                      src="/book_cover_img/book_cover_img (0).webp"
                      alt="book cover"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  {/* Review body */}
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="font-mono text-xs text-gray-400">
                      Book ID: {review.bookId.slice(0, 12)}…
                    </p>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`size-3.5 ${n <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                            }`}
                        />
                      ))}
                    </div>

                    {review.comment && (
                      <p className="leading-relaxed text-gray-700">
                        {review.comment}
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
