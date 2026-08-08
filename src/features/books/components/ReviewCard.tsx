"use client";

import { Star } from "lucide-react";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-1 py-4">
      <div className="flex text-red-500">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="size-3.5 fill-red-500 text-red-500" />
        ))}
      </div>
      <p className="pt-1 text-xs text-gray-800 sm:text-sm">{review.comment}</p>
      <p className="text-xs text-gray-400">
        By <span className="font-medium text-gray-600">{review.author}</span>,{" "}
        {review.date}
      </p>
    </div>
  );
}
