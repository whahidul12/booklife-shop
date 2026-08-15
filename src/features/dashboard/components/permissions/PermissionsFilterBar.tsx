"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, RotateCcw, Check } from "lucide-react";
import type { PermissionFilterState, PermissionAccessFilter } from "./types";

interface PermissionsFilterBarProps {
  filters: PermissionFilterState;
  onFilterChange: (filters: Partial<PermissionFilterState>) => void;
  onResetFilters: () => void;
}

export function PermissionsFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}: PermissionsFilterBarProps) {
  const [accessOpen, setAccessOpen] = useState(false);
  const accessRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accessRef.current && !accessRef.current.contains(e.target as Node)) {
        setAccessOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const accessOptions: { label: string; value: PermissionAccessFilter }[] = [
    { label: "All Access Levels", value: "all" },
    { label: "Full Access", value: "full" },
    { label: "Scoped Partial Access", value: "partial" },
    { label: "No Permissions", value: "none" },
  ];

  const currentAccessOption = accessOptions.find((s) => s.value === filters.accessLevel);

  const hasAnyFilter =
    filters.search !== "" ||
    filters.accessLevel !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search moderator by name or email..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-[#D10A13] focus:outline-none focus:ring-2 focus:ring-[#D10A13]/20"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
          <Search className="size-4" />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex items-center gap-2.5">
        {/* Access Level Dropdown */}
        <div className="relative" ref={accessRef}>
          <button
            type="button"
            onClick={() => setAccessOpen(!accessOpen)}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 ${
              filters.accessLevel !== "all"
                ? "border-[#D10A13] text-[#D10A13] bg-red-50/30"
                : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            <span>{filters.accessLevel === "all" ? "Access Level" : currentAccessOption?.label}</span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {accessOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {accessOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange({ accessLevel: opt.value });
                    setAccessOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filters.accessLevel === opt.value
                      ? "bg-red-50 text-[#D10A13]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.accessLevel === opt.value && (
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
