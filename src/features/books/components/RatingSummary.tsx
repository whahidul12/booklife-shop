"use client";

import { Star } from "lucide-react";
import { useBookDetail } from "../context/BookDetailContext";

export function RatingSummary() {
  const { avgRating, reviews } = useBookDetail();
  const displayRating = avgRating > 0 ? avgRating.toFixed(2) : "0.00";

  return (
    <div className="flex flex-col items-center justify-center border-b pb-6 md:col-span-3 md:border-r md:border-b-0 md:pb-0">
      <span className="text-5xl font-extrabold text-gray-900">{displayRating}</span>
      <div className="my-2 flex text-red-500">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-4 ${
              n <= Math.round(avgRating)
                ? "fill-red-500 text-red-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">{reviews.length} Ratings</span>
    </div>
  );
}
