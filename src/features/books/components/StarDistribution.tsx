"use client";

import { Star } from "lucide-react";
import { useBookDetail } from "../context/BookDetailContext";

export function StarDistribution() {
  const { starDistribution, reviews } = useBookDetail();
  const total = reviews.length;

  return (
    <div className="max-w-lg space-y-2 md:col-span-9">
      {starDistribution.map((item) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <div
            key={item.star}
            className="flex items-center gap-3 text-xs text-gray-600"
          >
            <div className="flex shrink-0 text-red-500">
              {Array.from({ length: item.star }).map((_, i) => (
                <Star key={i} className="size-3 fill-red-500 text-red-500" />
              ))}
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-4 text-right">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}
