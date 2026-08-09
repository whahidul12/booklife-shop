import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startLabel: number;
  endLabel: number;
  onPageChange: (page: number) => void;
}

function buildPageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];
  const delta = 2; // neighbours on each side

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);
  if (left > 2) pages.push("…");

  for (let p = left; p <= right; p++) pages.push(p);

  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startLabel,
  endLabel,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const window = buildPageWindow(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col items-start gap-3">
      {/* Item count label */}
      <p className="text-xs text-gray-500">
        {toBengaliNumber(startLabel)} – {toBengaliNumber(endLabel)}{" "}
        <span className="text-gray-400">of</span> {toBengaliNumber(totalItems)}
      </p>

      {/* Button row */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="আগের পাতা"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {window.map((item, idx) =>
          item === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-label={`পাতা ${item}`}
              aria-current={currentPage === item ? "page" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition ${
                currentPage === item
                  ? "border-red-500 bg-red-500 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              {toBengaliNumber(item)}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="পরের পাতা"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
