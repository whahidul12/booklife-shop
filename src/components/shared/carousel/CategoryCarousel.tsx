"use client";

import {
  categories as staticCategories,
  CategoryCard,
  useCategoryCarousel,
} from "@/features/carousel";
import type { CategoryItem } from "@/features/carousel/constants/carousel.const";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryCarouselProps {
  /** Live categories from DB — falls back to static mock if omitted */
  categories?: CategoryItem[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const data = categories?.length ? categories : staticCategories;
  const { visible, safeIndex, maxIndex, move, setActiveIndex } =
    useCategoryCarousel(data.length);

  return (
    <section
      className="bg-secondary/70 w-full py-5 md:py-7"
      aria-label="বইয়ের বিভাগ"
    >
      <div className="relative mx-auto max-w-350 px-4 md:px-6">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${safeIndex * (100 / visible)}%)`,
            }}
            aria-live="polite"
          >
            {data.map((category) => (
              <div
                key={category.title}
                className="shrink-0 px-2"
                style={{ width: `${100 / visible}%` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="আগের বিভাগ"
          className="border-border bg-background/95 text-foreground hover:text-brand focus-visible:ring-ring absolute top-1/2 left-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition focus-visible:ring-2 focus-visible:outline-none md:-left-1"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="পরের বিভাগ"
          className="border-border bg-background/95 text-foreground hover:text-brand focus-visible:ring-ring absolute top-1/2 right-1 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition focus-visible:ring-2 focus-visible:outline-none md:-right-1"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
