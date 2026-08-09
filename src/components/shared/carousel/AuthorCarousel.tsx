"use client";

import { authorsData } from "@/constants/constants";
import {
  AuthorCard,
  CarouselControls,
  useScrollCarousel,
} from "@/features/carousel";
import type { Author } from "@/types";
import Link from "next/link";

interface AuthorCarouselProps {
  title?: string;
  seeAllLink?: string;
  /** Live authors from DB — falls back to static mock if omitted */
  authors?: Author[];
}

export function AuthorCarousel({
  title = "জনপ্রিয় লেখক",
  seeAllLink = "/authors",
  authors,
}: AuthorCarouselProps) {
  const data = authors?.length ? authors : authorsData;

  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useScrollCarousel();

  return (
    <section className="relative mx-auto my-6 max-w-350 px-4">
      <div className="mb-3 flex items-center justify-between px-1">
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

      <div className="group relative">
        <CarouselControls
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
          ariaLabelPrev="Previous Authors"
          ariaLabelNext="Next Authors"
        />

        <div
          ref={scrollContainerRef}
          className="flex w-full snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </section>
  );
}
