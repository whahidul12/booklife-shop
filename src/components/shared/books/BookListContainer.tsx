"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { booksData } from "@/constants/constants";
import { BookCard, BookSidebar } from "@/features/book-list";
import type { Book } from "@/types";

interface DBBook {
  id: string;
  name: string;
  pricePaisa: number;
  discountPricePaisa: number | null;
  imageUrl: string | null;
  authorName?: string;
}

interface BookListContainerProps {
  /** Pre-fetched DB books from RSC parent */
  initialBooks?: DBBook[];
  /** Subject title to display in the header */
  subjectTitle?: string;
}

export const BookListContainer: React.FC<BookListContainerProps> = ({
  initialBooks,
  subjectTitle,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState("new_published");

  // Map DB books → BookCard-compatible shape
  const mappedBooks: (Book & { dbId: string })[] = useMemo(() => {
    if (!initialBooks?.length) return [];
    return initialBooks.map((b, idx) => {
      const price = Math.round(b.pricePaisa / 100);
      const discountPrice = b.discountPricePaisa
        ? Math.round(b.discountPricePaisa / 100)
        : null;
      const discountPct =
        discountPrice && discountPrice < price
          ? Math.round(((price - discountPrice) / price) * 100)
          : null;
      return {
        id: b.id,
        dbId: b.id,
        title: b.name,
        author: b.authorName ?? "",
        price: `${discountPrice ?? price}৳`,
        oldPrice: discountPrice ? `${price}৳` : undefined,
        discount: discountPct ? String(discountPct) : undefined,
        image: b.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
      };
    });
  }, [initialBooks]);

  // Use DB books when provided (even if empty), else fall back to static
  const sourceBooks = initialBooks !== undefined ? mappedBooks : (mappedBooks.length ? mappedBooks : (booksData as (Book & { dbId?: string })[]));
  const displayTitle = subjectTitle ?? "বইয়ের তালিকা";

  // Client-side price filter
  const afterPriceFilter = useMemo(() => {
    return sourceBooks.filter((book) => {
      const numericPrice = parseInt(
        (book.price as string).replace(/[^0-9]/g, ""),
        10,
      );
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
    });
  }, [sourceBooks, priceRange]);

  // Client-side sort
  const filteredBooks = useMemo(() => {
    const clone = [...afterPriceFilter];
    if (sortBy === "price_low") {
      clone.sort(
        (a, b) =>
          parseInt(String(a.price).replace(/[^0-9]/g, ""), 10) -
          parseInt(String(b.price).replace(/[^0-9]/g, ""), 10),
      );
    } else if (sortBy === "price_high") {
      clone.sort(
        (a, b) =>
          parseInt(String(b.price).replace(/[^0-9]/g, ""), 10) -
          parseInt(String(a.price).replace(/[^0-9]/g, ""), 10),
      );
    }
    return clone;
  }, [afterPriceFilter, sortBy]);

  return (
    <div className="mx-auto flex max-w-350 flex-col gap-6 px-4 py-8 md:flex-row">
      <BookSidebar priceRange={priceRange} setPriceRange={setPriceRange} />

      <main className="flex-1">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between border-b border-gray-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{displayTitle}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredBooks.length} of {sourceBooks.length} results
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-2 sm:mt-0">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
              <SelectTrigger className="h-9 w-45 bg-white text-sm">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_published">New Published</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {filteredBooks.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
            কোনো বই পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBooks.map((book) => (
              <BookCard key={(book as Book & { dbId?: string }).dbId ?? book.id} {...(book as Book & { dbId?: string })} />
            ))}
          </div>
        )}

        {/* Simple pagination placeholder */}
        {filteredBooks.length > 0 && (
          <div className="mt-12 flex justify-center space-x-2">
            <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
              &lt;
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-sm text-white">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
