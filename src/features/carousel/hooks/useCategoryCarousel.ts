"use client";

import { useEffect, useState } from "react";

/**
 * Manages the visible-count (responsive) and slide-index state
 * for the CSS-transform based CategoryCarousel.
 *
 * @param totalItems - Total number of category cards
 *
 * Returns:
 *  - visible    → how many cards to show at once (1 / 2 / 4)
 *  - safeIndex  → clamped active slide index
 *  - maxIndex   → maximum allowed index (totalItems - visible)
 *  - move       → advance by direction (+1 or -1), wraps around
 *  - setActiveIndex → jump directly to an index (for dot clicks)
 */
export function useCategoryCarousel(totalItems: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(4);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, totalItems - visible);
  const safeIndex = Math.min(activeIndex, maxIndex);

  const move = (direction: number) => {
    setActiveIndex(() => {
      const nextIndex = safeIndex + direction;
      if (nextIndex < 0) return maxIndex; // Loop back to end
      if (nextIndex > maxIndex) return 0; // Loop to start
      return nextIndex;
    });
  };

  return { visible, safeIndex, maxIndex, move, setActiveIndex };
}
