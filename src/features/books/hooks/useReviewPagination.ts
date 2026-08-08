"use client";

import { useState } from "react";

/**
 * Manages the current page state for the reviews pagination.
 *
 * Returns:
 *  - currentPage  → active page number (1-indexed)
 *  - goToPage     → jump to a specific page
 *  - prevPage     → go to previous page (no-op at page 1)
 *  - nextPage     → go to next page (no-op at maxPages)
 */
export function useReviewPagination(maxPages: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= maxPages) setCurrentPage(page);
  };

  const prevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const nextPage = () => {
    setCurrentPage((p) => Math.min(maxPages, p + 1));
  };

  return { currentPage, goToPage, prevPage, nextPage };
}
