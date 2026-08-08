"use client";

import { RatingSummary } from "./RatingSummary";
import { StarDistribution } from "./StarDistribution";
import { ReviewList } from "./ReviewList";

export function ReviewSection() {
  return (
    <section className="mt-10 rounded-md border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-base font-bold text-gray-900">
        রিভিউ এবং রেটিং
      </h2>

      {/* Rating Summary Grid */}
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
        <RatingSummary />
        <StarDistribution />
      </div>

      <ReviewList />
    </section>
  );
}
