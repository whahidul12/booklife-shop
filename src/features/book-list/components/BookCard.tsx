import React from "react";
import Image from "next/image";
import {
  formatPrice,
  parseBengaliNumber,
  toBengaliNumber,
} from "@/utils/formatters";
import Link from "next/link";

export interface BookCardProps {
  id: number | string;
  dbId?: string;
  title: string;
  author: string;
  price: string;
  oldPrice?: string | undefined;
  discount?: string | undefined;
  image: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  dbId,
  title,
  author,
  oldPrice,
  price,
  discount,
  image,
}) => {
  const discountPercentage = parseBengaliNumber(discount);
  const originalPrice = parseBengaliNumber(oldPrice);
  const currentPrice = parseBengaliNumber(price);
  const targetId = dbId || id;

  return (
    <Link
      href={`/books/${targetId}`}
      className="group relative flex cursor-pointer flex-col rounded-md border border-transparent bg-white p-3 transition-all hover:border-gray-200 hover:shadow-md"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div
          className="absolute top-2 left-2 z-10 flex h-10 w-8 flex-col items-center justify-center bg-red-600 text-xs font-bold text-white shadow-sm"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
          }}
        >
          <span>{toBengaliNumber(discountPercentage)}%</span>
          <span className="text-[10px] leading-none font-normal">ছাড়</span>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Book Info */}
      <div className="flex flex-col space-y-1">
        <h3 className="line-clamp-2 min-h-10 text-sm leading-tight font-semibold text-gray-900">
          {title}
        </h3>
        <p className="line-clamp-1 text-xs text-gray-500">{author}</p>

        <div className="mt-2 flex items-center space-x-2">
          <span className="text-sm font-bold text-red-600">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
