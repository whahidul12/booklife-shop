"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  User,
  Building2,
  Tag,
  DollarSign,
  Package,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { Book, Author, Publisher, Subject } from "@/db/schema";
import type { SubjectRow } from "./types";

interface BookViewModalProps {
  book: Book;
  authors: Author[];
  publishers: Publisher[];
  subjects: SubjectRow[];
  onClose: () => void;
  onEdit: () => void;
}

export function BookViewModal({
  book,
  authors,
  publishers,
  subjects,
  onClose,
  onEdit,
}: BookViewModalProps) {
  const author = authors.find((a) => a.id === book.authorId);
  const publisher = publishers.find((p) => p.id === book.publisherId);
  const subject = subjects.find((s) => s.id === book.subjectId);

  const price = (book.pricePaisa / 100).toFixed(0);
  const discountPrice = book.discountPricePaisa
    ? (book.discountPricePaisa / 100).toFixed(0)
    : null;

  const discountPercent =
    book.discountPricePaisa && book.pricePaisa > 0
      ? Math.round(
          ((book.pricePaisa - book.discountPricePaisa) / book.pricePaisa) * 100
        )
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#D10A13]">
              <BookOpen className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Book Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Main Info Hero */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Book Cover */}
            <div className="relative size-32 sm:size-36 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm flex items-center justify-center">
              {book.imageUrl ? (
                <Image
                  src={book.imageUrl}
                  alt={book.name}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              ) : (
                <BookOpen className="size-10 text-gray-300" />
              )}
            </div>

            {/* Book Title & Key Badges */}
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {book.isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="size-3" /> Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/60">
                    <XCircle className="size-3" /> Inactive
                  </span>
                )}

                {book.isFeatured && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    ★ Featured
                  </span>
                )}

                {book.isPreorder && (
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                    Pre-order
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {book.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                {author && (
                  <div className="flex items-center gap-1">
                    <User className="size-3.5 text-gray-400" />
                    <span className="font-medium text-gray-800">{author.name}</span>
                  </div>
                )}
                {publisher && (
                  <div className="flex items-center gap-1">
                    <Building2 className="size-3.5 text-gray-400" />
                    <span>{publisher.name}</span>
                  </div>
                )}
                {subject && (
                  <div className="flex items-center gap-1">
                    <Tag className="size-3.5 text-gray-400" />
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700 font-medium">
                      {subject.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing and Stock Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <p className="text-[11px] font-medium text-gray-500">Regular Price</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">৳ {price}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <p className="text-[11px] font-medium text-gray-500">Discount Price</p>
              <p className="text-base font-bold text-[#D10A13] mt-0.5">
                {discountPrice ? `৳ ${discountPrice}` : "—"}
                {discountPercent && (
                  <span className="ml-1 text-[10px] font-semibold text-emerald-600">
                    (-{discountPercent}%)
                  </span>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <p className="text-[11px] font-medium text-gray-500">Stock Count</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {book.stock} units
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <p className="text-[11px] font-medium text-gray-500">Stock Status</p>
              <div className="mt-0.5">
                {book.stock === 0 ? (
                  <span className="text-xs font-bold text-[#D10A13]">Out of Stock</span>
                ) : book.stock <= 5 ? (
                  <span className="text-xs font-bold text-amber-600">Low Stock</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Specification Grid */}
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Book Specification
            </h4>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-gray-400">Format</dt>
                <dd className="font-medium text-gray-800 capitalize mt-0.5">
                  {book.format || "Paperback"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Edition</dt>
                <dd className="font-medium text-gray-800 mt-0.5">
                  {book.edition || "Standard"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Total Pages</dt>
                <dd className="font-medium text-gray-800 mt-0.5">
                  {book.totalPages ? `${book.totalPages} Pages` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Language</dt>
                <dd className="font-medium text-gray-800 mt-0.5">
                  {book.language || "বাংলা"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Book ID</dt>
                <dd className="font-mono text-gray-600 mt-0.5 text-[11px] truncate">
                  {book.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Created Date</dt>
                <dd className="font-medium text-gray-800 mt-0.5">
                  {new Date(book.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          {book.description && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Description
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all"
          >
            <Pencil className="size-3.5" />
            <span>Edit Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}
