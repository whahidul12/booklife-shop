"use client";

import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";
import type { WishlistItem as WishlistItemType } from "@/features/navigation/store/types";
import { useAppStore } from "@/features/navigation/store/AppStoreContext";

interface WishlistItemProps {
  item: WishlistItemType;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { removeFromWishlist, moveToCart, isInCart } = useAppStore();
  const inCart = isInCart(item.id);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start gap-4">
        {/* Cover */}
        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-1">
          <h3 className="font-medium text-gray-900 leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500">{item.author}</p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-red-600">
              {toBengaliNumber(item.currentPrice)}৳
            </span>
            {item.originalPrice > item.currentPrice && (
              <span className="text-gray-400 line-through text-xs">
                {toBengaliNumber(item.originalPrice)}৳
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={() => moveToCart(item.id)}
            disabled={inCart}
            className={`mt-1.5 flex w-fit items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              inCart
                ? "bg-gray-100 text-gray-400 cursor-default"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <ShoppingCart className="size-3.5" />
            {inCart ? "কার্টে আছে" : "কার্টে যোগ করুন"}
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromWishlist(item.id)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        aria-label="Remove from wishlist"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
