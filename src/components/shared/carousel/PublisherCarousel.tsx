"use client";

import { publishersData } from "@/constants/constants";
import {
  CarouselControls,
  PublisherCard,
  useScrollCarousel,
} from "@/features/carousel";
import type { Publisher } from "@/types";
import Link from "next/link";

interface PublisherCarouselProps {
  title?: string;
  seeAllLink?: string;
  /** Live publishers from DB — falls back to static mock if omitted */
  publishers?: Publisher[];
}

export function PublisherCarousel({
  title = "জনপ্রিয় প্রকাশক",
  seeAllLink = "/publishers",
  publishers,
}: PublisherCarouselProps) {
  const data = publishers?.length ? publishers : publishersData;

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
          ariaLabelPrev="Previous Publishers"
          ariaLabelNext="Next Publishers"
        />

        <div
          ref={scrollContainerRef}
          className="flex w-full snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((publisher) => (
            <PublisherCard key={publisher.id} publisher={publisher} />
          ))}
        </div>
      </div>
    </section>
  );
}
