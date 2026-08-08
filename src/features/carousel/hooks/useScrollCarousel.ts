"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Encapsulates the scroll-state detection and scroll-by logic shared across
 * BookCarousel, AuthorCarousel, and PublisherCarousel.
 *
 * Returns:
 *  - scrollContainerRef  → attach to the scrollable <div>
 *  - canScrollLeft       → show left arrow when true
 *  - canScrollRight      → show right arrow when true
 *  - scrollLeft          → call to scroll 75% of container width left
 *  - scrollRight         → call to scroll 75% of container width right
 */
export function useScrollCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
    // checkScroll is defined inside the component closure — no deps needed
  }, []);

  const scrollLeft = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: -(el.clientWidth * 0.75), behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.75, behavior: "smooth" });
  };

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  };
}
