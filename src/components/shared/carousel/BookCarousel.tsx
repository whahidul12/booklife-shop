"use client";

import { booksData } from "@/constants/constants";
import {
  BookCard,
  CarouselControls,
  useScrollCarousel,
} from "@/features/carousel";
import type { Book } from "@/types";
import Link from "next/link";

interface BookCarouselProps {
  title?: string;
  seeAllLink?: string;
  /** Live books from DB — falls back to static mock if omitted */
  books?: (Book & { dbId?: string })[];
}

export function BookCarousel({
  title = "নতুন প্রকাশিত বই",
  seeAllLink = "#",
  books,
}: BookCarouselProps) {
  const data = books !== undefined ? books : booksData;

  if (books !== undefined && books.length === 0) {
    return null;
  }

  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useScrollCarousel();

  return (
    <section className="relative mx-auto my-8 max-w-350 bg-white px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-gray-800 sm:text-lg">
          {title}
        </h2>
        <Link
          href={seeAllLink}
          className="text-xs font-semibold text-red-600 transition-colors hover:underline sm:text-sm"
        >
          সবগুলো দেখুন
        </Link>
      </div>

      {/* Carousel */}
      <div className="group relative">
        <CarouselControls
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
          ariaLabelPrev="Previous Books"
          ariaLabelNext="Next Books"
          className="border-gray-100 hover:bg-gray-50"
        />

        <div
          ref={scrollContainerRef}
          className="flex w-full snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto scroll-smooth pt-1 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((book, idx) => (
            <BookCard key={(book as Book & { dbId?: string }).dbId ?? book.id ?? idx} book={book as Book & { dbId?: string }} />
          ))}
        </div>
      </div>
    </section>
  );
}
