"use client";

import Link from "next/link";
import { useState } from "react";
import { useBookDetail } from "../context/BookDetailContext";

export function BookMeta() {
  const { book, author, publisher, subject } = useBookDetail();
  const [expanded, setExpanded] = useState(false);

  const description = book.description || "";
  const shortDesc = description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">{book.name}</h1>

      {/* Subject badge */}
      {subject && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500">
            বিষয়:{" "}
            <Link
              href={`/subjects/${subject.slug}`}
              className="text-red-600 hover:underline"
            >
              {subject.title}
            </Link>
          </span>
        </div>
      )}

      {/* Author, Publisher, Subject, Specs */}
      <div className="space-y-1 text-sm text-gray-700">
        {author && (
          <p>
            লেখক :{" "}
            <Link href="/authors" className="font-medium text-red-600 hover:underline">
              {author.name}
            </Link>
          </p>
        )}
        {publisher && (
          <p>
            প্রকাশনী :{" "}
            <Link href="/publishers" className="text-gray-900 hover:underline">
              {publisher.name}
            </Link>
          </p>
        )}
        {subject && (
          <p>
            বিষয় :{" "}
            <Link
              href={`/subjects/${subject.slug}`}
              className="text-red-600 hover:underline"
            >
              {subject.title}
            </Link>
          </p>
        )}
        <p className="pt-1 text-xs text-gray-500">
          {[
            book.totalPages ? `পৃষ্ঠা : ${book.totalPages}` : null,
            book.format
              ? `কভার : ${book.format === "hardcover" ? "হার্ড কভার" : book.format === "paperback" ? "পেপারব্যাক" : "ই-বুক"}`
              : null,
            book.edition ? `সংস্করণ : ${book.edition}` : null,
            book.language ? `ভাষা : ${book.language}` : null,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>

      {/* Description */}
      {description && (
        <p className="pt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
          {expanded ? description : shortDesc}
          {description.length > 200 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 font-medium text-red-600 hover:underline"
            >
              {expanded ? "কম পড়ুন" : "আরো পড়ুন"}
            </button>
          )}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-2xl font-bold text-red-600">
          {book.discountPrice ?? book.price}৳
        </span>
        {book.discountPrice && (
          <>
            <span className="text-sm text-gray-400 line-through">{book.price}৳</span>
            <span className="text-xs font-semibold text-red-600">
              ({book.discountPct}% ছাড়)
            </span>
          </>
        )}
      </div>

      {/* Stock badge */}
      {book.stock === 0 && (
        <p className="text-xs font-semibold text-red-600">স্টক নেই</p>
      )}
    </>
  );
}
