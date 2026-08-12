"use client";

import { WishlistItem } from "@/features/dashboard/components/WishlistItem";
import { useAppStore } from "@/features/navigation/store/AppStoreContext";
import { Heart } from "lucide-react";
import Link from "next/link";

export function Wishlist() {
  const { wishlist } = useAppStore();

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        My Wishlist
        {wishlist.length > 0 && (
          <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            {wishlist.length}
          </span>
        )}
      </h2>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="mb-4 size-14 text-gray-300" />
          <p className="text-base font-medium text-gray-500">
            উইশলিস্ট খালি আছে
          </p>
          <p className="mt-1 text-sm text-gray-400">
            পছন্দের বই উইশলিস্টে যোগ করুন।
          </p>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            বই দেখুন
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {wishlist.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
