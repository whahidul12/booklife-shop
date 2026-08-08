/**
 * BookDetailContext
 *
 * Provides pre-fetched book data (from the RSC) to all client sub-components
 * without prop-drilling.
 *
 * Usage in any sub-component:
 *   const { book, author, reviews } = useBookDetail();
 */
"use client";

import { createContext, useContext } from "react";
import type { BookDetailData, ReviewData, RelatedBook } from "../components/BookDetailView";

interface BookDetailContextValue {
  book: BookDetailData;
  author: { id: string; name: string } | null;
  publisher: { id: string; name: string } | null;
  subject: { id: string; title: string; slug: string } | null;
  reviews: ReviewData[];
  avgRating: number;
  starDistribution: { star: number; count: number }[];
  relatedBooks: RelatedBook[];
}

export const BookDetailContext = createContext<BookDetailContextValue | null>(null);

export function useBookDetail(): BookDetailContextValue {
  const ctx = useContext(BookDetailContext);
  if (!ctx) {
    // Return safe defaults when rendered outside the provider (static pages, tests)
    return {
      book: {
        id: "",
        name: "রুকইয়াহ",
        description: "",
        imageUrl: "/book_cover_img/book_cover_img (0).webp",
        pricePaisa: 35500,
        discountPricePaisa: null,
        price: 355,
        discountPrice: null,
        discountPct: null,
        totalPages: 312,
        edition: "1st Published, 2023",
        language: "বাংলা",
        format: "hardcover",
        stock: 10,
      },
      author: { id: "", name: "আব্দুল্লাহ আল-মাহমুন" },
      publisher: { id: "", name: "সন্দীপন প্রকাশন" },
      subject: { id: "", title: "ইসলামি চিকিৎসা ও স্বাস্থ্যবিধি", slug: "health-care" },
      reviews: [],
      avgRating: 0,
      starDistribution: [5, 4, 3, 2, 1].map((s) => ({ star: s, count: 0 })),
      relatedBooks: [],
    };
  }
  return ctx;
}
