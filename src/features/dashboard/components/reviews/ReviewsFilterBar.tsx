"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Star,
} from "lucide-react";
import type { ReviewFilterState, ReviewStatusFilter, ReviewRatingFilter } from "./types";
import { DateRangePicker, DateRange } from "../overview/DateRangePicker";

interface ReviewsFilterBarProps {
  filters: ReviewFilterState;
  onFilterChange: (filters: Partial<ReviewFilterState>) => void;
  onResetFilters: () => void;
}

export function ReviewsFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}: ReviewsFilterBarProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(e.target as Node)) {
        setRatingOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions: { label: string; value: ReviewStatusFilter }[] = [
    { label: "All Status", value: "all" },
    { label: "Visible (Published)", value: "visible" },
    { label: "Hidden (Moderated)", value: "hidden" },
  ];

  const ratingOptions: { label: string; value: ReviewRatingFilter; stars?: number }[] = [
    { label: "All Ratings", value: "all" },
    { label: "5 Stars", value: "5", stars: 5 },
    { label: "4 Stars", value: "4", stars: 4 },
    { label: "3 Stars", value: "3", stars: 3 },
    { label: "2 Stars", value: "2", stars: 2 },
    { label: "1 Star", value: "1", stars: 1 },
  ];

  const currentStatusOption = statusOptions.find((s) => s.value === filters.status);
  const currentRatingOption = ratingOptions.find((r) => r.value === filters.rating);

  const hasAnyFilter =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.rating !== "all" ||
    filters.dateRange !== null;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search comments, users, or books..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-[#D10A13] focus:outline-none focus:ring-2 focus:ring-[#D10A13]/20"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
          <Search className="size-4" />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Picker */}
        <DateRangePicker
          value={filters.dateRange ?? undefined}
          onChange={(range) => onFilterChange({ dateRange: range })}
          align="right"
        />

        {/* Rating Filter Dropdown */}
        <div className="relative" ref={ratingRef}>
          <button
            type="button"
            onClick={() => {
              setRatingOpen(!ratingOpen);
              setStatusOpen(false);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              filters.rating !== "all"
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <Star className="size-3.5 text-amber-500 fill-amber-500" />
            <span>{filters.rating === "all" ? "Rating" : currentRatingOption?.label}</span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {ratingOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange({ rating: opt.value });
                    setRatingOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filters.rating === opt.value
                      ? "bg-red-50 text-[#D10A13]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {opt.stars && (
                      <span className="flex items-center">
                        {Array.from({ length: opt.stars }).map((_, i) => (
                          <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    )}
                    <span>{opt.label}</span>
                  </div>
                  {filters.rating === opt.value && (
                    <Check className="size-3.5 text-[#D10A13]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setStatusOpen(!statusOpen);
              setRatingOpen(false);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              filters.status !== "all"
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <span>{filters.status === "all" ? "Status" : currentStatusOption?.label}</span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {statusOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange({ status: opt.value });
                    setStatusOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filters.status === opt.value
                      ? "bg-red-50 text-[#D10A13]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.status === opt.value && (
                    <Check className="size-3.5 text-[#D10A13]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Reset button if any filter is active */}
        {hasAnyFilter && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 rounded-xl border border-dashed border-red-200 bg-red-50/50 px-3 py-2.5 text-xs font-medium text-[#D10A13] hover:bg-red-100/50 transition-colors"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
