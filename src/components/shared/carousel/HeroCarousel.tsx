"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners as staticBanners, useAutoplay } from "@/features/carousel";
import type { Banner } from "@/features/carousel/constants/carousel.const";

interface HeroCarouselProps {
  /** Live banners from DB — falls back to static mock if omitted */
  banners?: Banner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const data = banners?.length ? banners : staticBanners;
  const { active, move, setActive } = useAutoplay(data.length, 4000);

  return (
    <section
      className="mx-auto max-w-350 px-4 py-5 md:px-6 md:py-7"
      aria-label="বিশেষ অফার"
    >
      <div className="group bg-card relative min-h-56 overflow-hidden rounded-lg sm:min-h-72 lg:aspect-[4.8/1] lg:min-h-0">
        {data.map((banner, index) => (
          <div
            key={banner.image}
            className={`absolute inset-0 transition-opacity duration-500 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={index !== active}
          >
            <Image
              src={banner.image}
              alt={banner.title ?? ""}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="আগের ব্যানার"
          className="group/prev bg-background/90 text-foreground focus-visible:ring-ring hover:cursor-pointer hover:bg-red-500 absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft
            aria-hidden="true"
            className="group-hover/prev:text-white"
          />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="পরের ব্যানার"
          className="group/next bg-background/90 text-foreground hover:bg-red-500 focus-visible:ring-ring hover:cursor-pointer absolute top-1/2 right-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronRight
            aria-hidden="true"
            className="group-hover/next:text-white"
          />
        </button>
      </div>
    </section>
  );
}
