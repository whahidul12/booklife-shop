"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, ChevronDown, Check, AlertCircle } from "lucide-react";
import type { Book, Author, Publisher } from "@/db/schema";
import type { SubjectRow } from "./types";
import { BookActionMenu } from "./BookActionMenu";

interface BooksTableProps {
  books: Book[];
  authors: Author[];
  publishers: Publisher[];
  subjects: SubjectRow[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

export function BooksTable({
  books,
  authors,
  publishers,
  subjects,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewBook,
  onEditBook,
  onDeleteBook,
}: BooksTableProps) {
  const authorMap = new Map(authors.map((a) => [a.id, a.name]));
  const publisherMap = new Map(publishers.map((p) => [p.id, p.name]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s.title]));

  const allSelected = books.length > 0 && selectedIds.length === books.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < books.length;

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
              <th className="px-4 py-4 font-semibold text-gray-600">Product Name</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Category</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Stock</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Price</th>
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
              // Skeleton / Loading state
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gray-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-32 rounded bg-gray-200" />
                        <div className="h-2.5 w-20 rounded bg-gray-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3 w-12 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <BookOpen className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No books found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query, status, date range, or category filters.
                  </p>
                </td>
              </tr>
            ) : (
              books.map((book) => {
                const isSelected = selectedIds.includes(book.id);
                const categoryTitle =
                  (book.subjectId && subjectMap.get(book.subjectId)) || "General";
                const authorName =
                  (book.authorId && authorMap.get(book.authorId)) || null;

                const priceFormatted = (book.pricePaisa / 100).toFixed(0);
                const discountFormatted = book.discountPricePaisa
                  ? (book.discountPricePaisa / 100).toFixed(0)
                  : null;

                // Stock text & status
                const isOutOfStock = book.stock === 0;
                const isLowStock = book.stock > 0 && book.stock <= 5;

                // Status pill
                let statusBadge;
                if (!book.isActive) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 border border-rose-100">
                      Inactive
                      <ChevronDown className="size-3 text-rose-400" />
                    </span>
                  );
                } else if (isOutOfStock) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 border border-amber-100">
                      Stock Out
                      <ChevronDown className="size-3 text-amber-400" />
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                      Published
                      <ChevronDown className="size-3 text-emerald-400" />
                    </span>
                  );
                }

                return (
                  <tr
                    key={book.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(book.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Product Name & Thumbnail */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onViewBook(book)}
                          className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100 shadow-2xs transition-transform hover:scale-105 flex items-center justify-center"
                        >
                          {book.imageUrl ? (
                            <Image
                              src={book.imageUrl}
                              alt={book.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <BookOpen className="size-4.5 text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0 max-w-xs">
                          <p
                            onClick={() => onViewBook(book)}
                            className="truncate text-xs font-semibold text-gray-900 hover:text-[#D10A13] cursor-pointer transition-colors"
                            title={book.name}
                          >
                            {book.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {authorName && (
                              <span className="truncate text-[11px] text-gray-500">
                                {authorName}
                              </span>
                            )}
                            {book.isFeatured && (
                              <span className="rounded bg-amber-50 px-1 py-0.2 text-[9px] font-bold text-amber-700 border border-amber-200">
                                Featured
                              </span>
                            )}
                            {book.isPreorder && (
                              <span className="rounded bg-purple-50 px-1 py-0.2 text-[9px] font-bold text-purple-700 border border-purple-200">
                                Pre-order
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                      {categoryTitle}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5 text-xs">
                      {isOutOfStock ? (
                        <span className="font-semibold text-red-600">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <span>{book.stock}</span>
                          <span className="font-medium text-amber-600">Low Stock</span>
                        </span>
                      ) : (
                        <span className="text-gray-700 font-medium">
                          {book.stock}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-900">
                      {discountFormatted ? (
                        <div className="flex flex-col">
                          <span>৳ {discountFormatted}</span>
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳ {priceFormatted}
                          </span>
                        </div>
                      ) : (
                        <span>৳ {priceFormatted}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">{statusBadge}</td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <BookActionMenu
                        book={book}
                        onView={onViewBook}
                        onEdit={onEditBook}
                        onDelete={onDeleteBook}
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
