"use client";

import Image from "next/image";
import Link from "next/link";
import { useBookDetail } from "../context/BookDetailContext";

export function RelatedBooksSidebar() {
  const { relatedBooks, book } = useBookDetail();

  // Filter out current book and take at most 5
  const displayBooks = relatedBooks
    .filter((b) => b.id !== book.id)
    .slice(0, 5);

  return (
    <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm lg:col-span-4">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-sm font-bold text-gray-800">আরো দেখুন...</h2>
        <Link
          href="/subjects"
          className="text-xs font-medium text-red-600 hover:underline"
        >
          সবগুলো দেখুন
        </Link>
      </div>

      {displayBooks.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">
          সম্পর্কিত বই পাওয়া যায়নি
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {displayBooks.map((b) => {
            const price = Math.round(b.pricePaisa / 100);
            const discountPrice = b.discountPricePaisa
              ? Math.round(b.discountPricePaisa / 100)
              : null;
            const discountPct =
              discountPrice && discountPrice < price
                ? Math.round(((price - discountPrice) / price) * 100)
                : null;

            return (
              <Link key={b.id} href={`/books/${b.id}`} className="flex gap-3 py-3 hover:opacity-90">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-gray-200">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex flex-col justify-center text-xs">
                  <h3 className="line-clamp-1 cursor-pointer font-semibold text-gray-800 hover:text-red-600">
                    {b.name}
                  </h3>
                  {b.authorName && (
                    <p className="line-clamp-1 text-gray-500">{b.authorName}</p>
                  )}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="font-bold text-red-600">
                      {discountPrice ?? price}৳
                    </span>
                    {discountPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {price}৳
                      </span>
                    )}
                    {discountPct && (
                      <span className="text-[10px] text-gray-500">
                        ({discountPct}% ছাড়)
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
