"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";
import type { BookFilterState, BookStatusFilter, SubjectRow } from "./types";
import { DateRangePicker, DateRange } from "../overview/DateRangePicker";

interface BooksFilterBarProps {
  filters: BookFilterState;
  subjects: SubjectRow[];
  onFilterChange: (filters: Partial<BookFilterState>) => void;
  onResetFilters: () => void;
}

export function BooksFilterBar({
  filters,
  subjects,
  onFilterChange,
  onResetFilters,
}: BooksFilterBarProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (advancedRef.current && !advancedRef.current.contains(e.target as Node)) {
        setAdvancedOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions: { label: string; value: BookStatusFilter }[] = [
    { label: "All Status", value: "all" },
    { label: "Published", value: "published" },
    { label: "Draft List", value: "draft" },
    { label: "Inactive", value: "inactive" },
    { label: "In Stock", value: "in_stock" },
    { label: "Low Stock", value: "low_stock" },
    { label: "Stock Out", value: "out_of_stock" },
  ];

  const activeCategory = subjects.find((s) => s.id === filters.subjectId);
  const currentStatusOption = statusOptions.find((s) => s.value === filters.status);

  const hasAdvancedFilters =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.format !== undefined ||
    filters.isFeatured !== undefined ||
    filters.isPreorder !== undefined;

  const hasAnyFilter =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.subjectId !== "" ||
    filters.dateRange !== null ||
    hasAdvancedFilters;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search"
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

        {/* Status Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setStatusOpen(!statusOpen);
              setCategoryOpen(false);
              setAdvancedOpen(false);
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
            <div className="absolute right-0 z-40 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
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

        {/* Category Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            type="button"
            onClick={() => {
              setCategoryOpen(!categoryOpen);
              setStatusOpen(false);
              setAdvancedOpen(false);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              filters.subjectId !== ""
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <span className="max-w-[120px] truncate">
              {filters.subjectId === "" ? "Category" : activeCategory?.title || "Category"}
            </span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {categoryOpen && (
            <div className="absolute right-0 z-40 mt-1.5 max-h-60 w-52 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  onFilterChange({ subjectId: "" });
                  setCategoryOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  filters.subjectId === ""
                    ? "bg-red-50 text-[#D10A13]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>All Categories</span>
                {filters.subjectId === "" && (
                  <Check className="size-3.5 text-[#D10A13]" />
                )}
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ subjectId: sub.id });
                    setCategoryOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filters.subjectId === sub.id
                      ? "bg-red-50 text-[#D10A13]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{sub.title}</span>
                  {filters.subjectId === sub.id && (
                    <Check className="size-3.5 text-[#D10A13]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Popover Button */}
        <div className="relative" ref={advancedRef}>
          <button
            type="button"
            onClick={() => {
              setAdvancedOpen(!advancedOpen);
              setStatusOpen(false);
              setCategoryOpen(false);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              hasAdvancedFilters
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <SlidersHorizontal className="size-3.5 text-gray-500" />
            <span>Filter</span>
            {hasAdvancedFilters && (
              <span className="size-2 rounded-full bg-[#D10A13]" />
            )}
          </button>

          {advancedOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Advanced Filters
                </h4>
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="mt-3.5 space-y-4 text-xs">
                {/* Format Filter */}
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Book Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["paperback", "hardcover", "ebook"].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() =>
                          onFilterChange({
                            format: filters.format === fmt ? undefined : fmt,
                          })
                        }
                        className={`rounded-lg border px-2 py-1.5 text-center capitalize transition-all ${
                          filters.format === fmt
                            ? "border-[#D10A13] bg-red-50 font-semibold text-[#D10A13]"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.isFeatured === true}
                      onChange={(e) =>
                        onFilterChange({
                          isFeatured: e.target.checked ? true : undefined,
                        })
                      }
                      className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                    />
                    <span>Featured Books only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.isPreorder === true}
                      onChange={(e) =>
                        onFilterChange({
                          isPreorder: e.target.checked ? true : undefined,
                        })
                      }
                      className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                    />
                    <span>Pre-order Books only</span>
                  </label>
                </div>

                {/* Reset Buttons in Popover */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        format: undefined,
                        isFeatured: undefined,
                        isPreorder: undefined,
                        minPrice: undefined,
                        maxPrice: undefined,
                      });
                    }}
                    className="text-[11px] font-medium text-gray-500 hover:text-gray-800"
                  >
                    Clear advanced
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdvancedOpen(false)}
                    className="rounded-lg bg-[#D10A13] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b5080f]"
                  >
                    Apply
                  </button>
                </div>
              </div>
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
