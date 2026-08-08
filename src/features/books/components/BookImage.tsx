"use client";

import Image from "next/image";
import { useBookDetail } from "../context/BookDetailContext";

export function BookImage() {
  const { book } = useBookDetail();

  return (
    <div className="flex shrink-0 flex-col items-center">
      <span className="mb-2 text-xs font-medium text-red-600">
        কিছু অংশ পড়ে দেখতে নিচের ছবিতে ক্লিক করুন ↴
      </span>
      <div className="relative h-72 w-52 cursor-pointer overflow-hidden rounded border border-gray-200 bg-gray-50 shadow-sm transition-transform hover:scale-105">
        <Image
          src={book.imageUrl}
          alt={book.name}
          fill
          priority
          className="object-cover"
          sizes="208px"
        />
      </div>
    </div>
  );
}
