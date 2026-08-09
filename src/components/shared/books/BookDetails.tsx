"use client";

import { BookHero } from "../../../features/books/components/BookHero";
import { RelatedBooksSidebar } from "../../../features/books/components/RelatedBooksSidebar";
import { OfferInfoBox } from "../../../features/books/components/OfferInfoBox";
import { ReviewSection } from "../../../features/books/components/ReviewSection";
import { QASection } from "../../../features/books/components/QASection";

export function BookDetails() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <BookHero />
          <RelatedBooksSidebar />
        </div>
        <OfferInfoBox />
        <ReviewSection />
        <QASection />
      </main>
    </div>
  );
}
