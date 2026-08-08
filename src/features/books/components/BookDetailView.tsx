/**
 * BookDetailView
 *
 * Receives pre-fetched DB data from the RSC page and distributes it to the
 * existing sub-components (BookHero, BookMeta, BookImage, BookCTA,
 * RelatedBooksSidebar, ReviewSection) via React Context.
 *
 * Must be a Client Component because it renders a React Context Provider.
 * The parent RSC page (books/[bookId]/page.tsx) fetches the data server-side
 * and passes it down as props — this component just provides it via context.
 */
"use client";
import React from "react";
import { BookDetailContext } from "../context/BookDetailContext";
import { BookHero } from "./BookHero";
import { RelatedBooksSidebar } from "./RelatedBooksSidebar";
import { OfferInfoBox } from "./OfferInfoBox";
import { ReviewSection } from "./ReviewSection";
import { QASection } from "./QASection";

export interface BookDetailData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePaisa: number;
  discountPricePaisa: number | null;
  price: number;
  discountPrice: number | null;
  discountPct: number | null;
  totalPages: number | null;
  edition: string | null;
  language: string | null;
  format: "hardcover" | "paperback" | "ebook" | null;
  stock: number;
}

export interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
}

export interface RelatedBook {
  id: string;
  name: string;
  imageUrl: string;
  pricePaisa: number;
  discountPricePaisa: number | null;
  authorName: string;
}

interface BookDetailViewProps {
  book: BookDetailData;
  author: { id: string; name: string } | null;
  publisher: { id: string; name: string } | null;
  subject: { id: string; title: string; slug: string } | null;
  reviews: ReviewData[];
  avgRating: number;
  starDistribution: { star: number; count: number }[];
  relatedBooks: RelatedBook[];
}

export function BookDetailView({
  book,
  author,
  publisher,
  subject,
  reviews,
  avgRating,
  starDistribution,
  relatedBooks,
}: BookDetailViewProps) {
  return (
    <BookDetailContext.Provider
      value={{ book, author, publisher, subject, reviews, avgRating, starDistribution, relatedBooks }}
    >
      <div className="min-h-screen bg-gray-50/50 pb-16">
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <BookHero />
            <RelatedBooksSidebar />
          </div>

          <OfferInfoBox />
          <ReviewSection />
          <QASection />
        </main>
      </div>
    </BookDetailContext.Provider>
  );
}
