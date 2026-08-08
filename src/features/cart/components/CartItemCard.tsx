"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";
import type { CartItem } from "@/features/navigation/store/types";
import { useAppStore } from "@/features/navigation/store/AppStoreContext";

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, addToWishlist, isInWishlist } =
    useAppStore();

  const inWishlist = isInWishlist(item.id);

  const handleMoveToWishlist = () => {
    addToWishlist({
      id: item.id,
      title: item.title,
      author: item.author,
      currentPrice: item.currentPrice,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
    });
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-start justify-between border-b border-gray-100 py-6 last:border-none">
      {/* Left: Cover Image & Info */}
      <div className="flex gap-4">
        <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            unoptimized
            className="object-contain p-1"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm leading-snug font-semibold text-gray-800">
              {item.title}{" "}
              <span className="font-normal text-gray-600">
                × {toBengaliNumber(item.quantity)}
              </span>
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{item.author}</p>
          </div>

          {/* Stepper & Actions */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-3 text-center text-sm font-semibold text-gray-800">
                {toBengaliNumber(item.quantity)}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1 text-gray-500">
              <button
                onClick={() => removeFromCart(item.id)}
                className="transition hover:text-red-600"
                title="Remove item"
                aria-label="Remove from cart"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleMoveToWishlist}
                className={`transition ${inWishlist ? "text-red-500" : "hover:text-red-600"}`}
                title={inWishlist ? "Already in wishlist" : "Move to wishlist"}
                aria-label="Move to wishlist"
                disabled={inWishlist}
              >
                <Heart
                  className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Price */}
      <div className="text-right">
        <div className="text-base font-bold text-gray-800">
          {toBengaliNumber(item.currentPrice * item.quantity)}৳
        </div>
        {item.originalPrice > item.currentPrice && (
          <div className="text-xs text-gray-400 line-through">
            {toBengaliNumber(item.originalPrice * item.quantity)}৳
          </div>
        )}
      </div>
    </div>
  );
};
