"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, RotateCcw, Check } from "lucide-react";
import type { PublisherFilterState, PublisherLogoFilter } from "./types";
import { DateRangePicker } from "../overview/DateRangePicker";

interface PublishersFilterBarProps {
  filters: PublisherFilterState;
  onFilterChange: (filters: Partial<PublisherFilterState>) => void;
  onResetFilters: () => void;
}

export function PublishersFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}: PublishersFilterBarProps) {
  const [logoOpen, setLogoOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (logoRef.current && !logoRef.current.contains(e.target as Node)) {
        setLogoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoOptions: { label: string; value: PublisherLogoFilter }[] = [
    { label: "All Publishers", value: "all" },
    { label: "With Logo Only", value: "has_logo" },
    { label: "Without Logo", value: "no_logo" },
  ];

  const currentLogoOption = logoOptions.find((s) => s.value === filters.logoStatus);

  const hasAnyFilter =
    filters.search !== "" ||
    filters.logoStatus !== "all" ||
    filters.dateRange !== null;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by publisher name..."
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

        {/* Logo Dropdown */}
        <div className="relative" ref={logoRef}>
          <button
            type="button"
            onClick={() => setLogoOpen(!logoOpen)}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              filters.logoStatus !== "all"
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <span>{filters.logoStatus === "all" ? "Logo Artwork" : currentLogoOption?.label}</span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {logoOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {logoOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange({ logoStatus: opt.value });
                    setLogoOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filters.logoStatus === opt.value
                      ? "bg-red-50 text-[#D10A13]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.logoStatus === opt.value && (
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
