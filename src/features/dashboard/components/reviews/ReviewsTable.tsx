"use client";

import React from "react";
import Image from "next/image";
import { Star, MessageSquare, BookOpen, User, ChevronDown, CheckCircle2, EyeOff } from "lucide-react";
import type { Review, Book } from "@/db/schema";
import { ReviewActionMenu } from "./ReviewActionMenu";

interface ReviewsTableProps {
  reviews: Review[];
  books: Book[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewReview: (review: Review) => void;
  onEditReview: (review: Review) => void;
  onToggleHideReview: (review: Review) => void;
  onDeleteReview: (review: Review) => void;
}

export function ReviewsTable({
  reviews,
  books,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewReview,
  onEditReview,
  onToggleHideReview,
  onDeleteReview,
}: ReviewsTableProps) {
  const bookMap = new Map(books.map((b) => [b.id, b]));

  const allSelected = reviews.length > 0 && selectedIds.length === reviews.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < reviews.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-semibold text-gray-600">User</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Book</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Rating</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Comment</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Date</th>
              <th className="px-4 py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ChevronDown className="size-3 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-32 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-48 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <MessageSquare className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No reviews found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query, rating, or status filters.
                  </p>
                </td>
              </tr>
            ) : (
              reviews.map((rev) => {
                const isSelected = selectedIds.includes(rev.id);
                const book = bookMap.get(rev.bookId);

                return (
                  <tr
                    key={rev.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    } ${rev.isHidden ? "bg-gray-50/40" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(rev.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* User */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-[11px] shrink-0">
                          <User className="size-3.5 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-gray-900 truncate">
                            {rev.userId.slice(0, 10)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Book */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                          {book?.imageUrl ? (
                            <Image
                              src={book.imageUrl}
                              alt={book.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          ) : (
                            <BookOpen className="size-3.5 text-gray-400" />
                          )}
                        </div>
                        <p
                          className="truncate text-xs font-medium text-gray-800 hover:text-[#D10A13] cursor-pointer transition-colors"
                          onClick={() => onViewReview(rev)}
                          title={book?.name || rev.bookId}
                        >
                          {book?.name || `ID: ${rev.bookId.slice(0, 8)}...`}
                        </p>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="flex items-center">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="size-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </span>
                        <span className="text-[11px] font-bold text-gray-700 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <p
                        className="truncate text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                        onClick={() => onViewReview(rev)}
                        title={rev.comment || ""}
                      >
                        {rev.comment || <span className="italic text-gray-400">No comment</span>}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {rev.isHidden ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                          <EyeOff className="size-3" /> Hidden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="size-3" /> Visible
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <ReviewActionMenu
                        review={rev}
                        onView={onViewReview}
                        onEdit={onEditReview}
                        onToggleHide={onToggleHideReview}
                        onDelete={onDeleteReview}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
