"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const ITEMS_PER_PAGE = 60;
const DEBOUNCE_MS = 250;

export const useDirectoryFilters = (
  allItems: { id: string; name: string; imageUrl: string }[],
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setCurrentPage(1); // always jump to page 1 on new search
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const normalised = debouncedQuery.trim().toLowerCase();
  const filteredItems = normalised
    ? allItems.filter((item) => item.name.toLowerCase().includes(normalised))
    : allItems;

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const safePage = Math.min(currentPage, totalPages);

  const startIdx = (safePage - 1) * ITEMS_PER_PAGE; // 0-based
  const pageItems = filteredItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const startLabel = totalItems === 0 ? 0 : startIdx + 1; // 1-based display
  const endLabel = Math.min(startIdx + ITEMS_PER_PAGE, totalItems);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    // raw input value (instant)
    searchQuery,
    handleSearchChange,

    // paginated slice to render
    pageItems,

    // pagination state
    currentPage: safePage,
    totalPages,
    totalItems,
    startLabel,
    endLabel,

    handlePageChange,
  };
};
