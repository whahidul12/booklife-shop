"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface ReviewsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ReviewsPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: ReviewsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 text-xs text-gray-500">
      {/* Left: Result counter & Per-page selector */}
      <div className="flex items-center gap-3">
        <span>
          Result <strong className="font-semibold text-gray-800">{startItem}-{endItem}</strong> of{" "}
          <strong className="font-semibold text-gray-800">{totalItems}</strong>
        </span>

        <div className="relative inline-flex items-center">
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 focus:border-[#D10A13] focus:outline-none focus:ring-1 focus:ring-[#D10A13]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-gray-400" />
        </div>
      </div>

      {/* Right: Page navigation buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all active:scale-95"
        >
          <ChevronLeft className="size-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((item, idx) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-gray-400 select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = item === currentPage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`min-w-8 h-8 rounded-xl px-2 text-xs font-semibold transition-all active:scale-95 ${
                  isActive
                    ? "bg-[#D10A13] text-white shadow-sm shadow-red-500/20"
                    : "text-gray-700 hover:bg-gray-100/80 border border-transparent hover:border-gray-200"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all active:scale-95"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
