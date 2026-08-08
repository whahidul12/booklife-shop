import Image from "next/image";
import type { Book } from "@/types";
import Link from "next/link";

interface BookCardProps {
  book: Book & { dbId?: string };
}

export function BookCard({ book }: BookCardProps) {
  // Use real DB string id when available, otherwise fall back to numeric id
  const href = book.dbId ? `/books/${book.dbId}` : `/books/${book.id}`;

  return (
    <div className="w-36 shrink-0 snap-start transition-all hover:-translate-y-0.5 sm:w-40 md:w-44 lg:w-48">
      <Link href={href} className="group/card cursor-pointer">
        {/* Book Cover Container */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded border border-gray-100 bg-gray-100 shadow-xs">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 192px"
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />

          {/* Circular Discount Badge */}
          {book.discount && (
            <div className="absolute top-2 left-2 z-10 flex size-9 flex-col items-center justify-center rounded-full bg-red-600 text-white shadow-md sm:size-10">
              <span className="text-[10px] leading-none font-extrabold sm:text-xs">
                {book.discount.split(" ")[0]}
              </span>
              <span className="text-[8px] leading-none font-bold sm:text-[9px]">
                OFF
              </span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="mt-2.5 space-y-1">
          <h3
            className="line-clamp-2 text-xs leading-snug font-semibold text-gray-800 transition-colors group-hover/card:text-red-600 sm:text-sm"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="line-clamp-1 text-[11px] text-gray-500 sm:text-xs">
            {book.author}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs font-bold text-red-600 sm:text-sm">
              {book.price}
            </span>
            {book.oldPrice && (
              <span className="text-[11px] text-gray-400 line-through sm:text-xs">
                {book.oldPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
