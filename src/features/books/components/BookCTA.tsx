"use client";

import { useAppStore } from "@/features/navigation/store/AppStoreContext";
import { Heart, Share2, ShoppingCart, Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookDetail } from "../context/BookDetailContext";
import { useState, useEffect } from "react";

export function BookCTA() {
  const router = useRouter();
  const { book, author } = useBookDetail();
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useAppStore();

  const inCart     = isInCart(book.id);
  const inWishlist = isInWishlist(book.id);

  const effectivePrice = book.discountPrice ?? book.price;

  // After adding to cart we show a brief "Added!" state, then navigate
  const [justAdded, setJustAdded]         = useState(false);
  const [justWishlisted, setJustWishlisted] = useState(false);

  // Navigate to cart AFTER React has committed the state update + localStorage write
  useEffect(() => {
    if (!justAdded) return;
    // Small timeout ensures setState → saveState → localStorage are all done
    const id = setTimeout(() => {
      router.push("/cart");
    }, 300);
    return () => clearTimeout(id);
  }, [justAdded, router]);

  const handleAddToCart = () => {
    if (inCart) {
      // Already in cart — go directly
      router.push("/cart");
      return;
    }
    addToCart({
      id:            book.id,
      title:         book.name,
      author:        author?.name ?? "",
      currentPrice:  effectivePrice,
      originalPrice: book.price,
      imageUrl:      book.imageUrl,
    });
    setJustAdded(true);
  };

  const handleAddToWishlist = () => {
    if (inWishlist) return;
    addToWishlist({
      id:            book.id,
      title:         book.name,
      author:        author?.name ?? "",
      currentPrice:  effectivePrice,
      originalPrice: book.price,
      imageUrl:      book.imageUrl,
    });
    setJustWishlisted(true);
    // Reset the visual indicator after 2 s
    setTimeout(() => setJustWishlisted(false), 2000);
  };

  const handleShare = () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: book.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* ── Primary CTA Buttons ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 pt-3">
        {/* Add to Cart / View Cart */}
        <button
          onClick={handleAddToCart}
          disabled={book.stock === 0 || justAdded}
          className={`flex items-center gap-2 rounded px-6 py-2.5 text-sm font-semibold text-white shadow transition-all disabled:cursor-not-allowed ${
            inCart || justAdded
              ? "bg-green-600 hover:bg-green-700 disabled:bg-green-600"
              : "bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
          }`}
        >
          {inCart || justAdded ? (
            <>
              <Check className="size-4" />
              {justAdded ? "যোগ হয়েছে..." : "কার্টে যান"}
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              {book.stock === 0 ? "স্টক নেই" : "কার্টে যোগ করুন"}
            </>
          )}
        </button>

        {/* View Cart shortcut (shown after adding) */}
        {inCart && !justAdded && (
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 rounded border border-green-500 px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            <ShoppingBag className="size-4" />
            কার্ট দেখুন
          </button>
        )}

        <button className="rounded bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-orange-600">
          একটু পড়ে দেখুন
        </button>
      </div>

      {/* ── Secondary Actions ───────────────────────────────────────── */}
      <div className="flex items-center gap-6 pt-2 text-xs text-gray-600">
        {/* Wishlist */}
        <button
          onClick={handleAddToWishlist}
          disabled={inWishlist}
          className={`flex items-center gap-1.5 transition-colors ${
            inWishlist || justWishlisted
              ? "cursor-default text-red-600"
              : "hover:text-red-600"
          }`}
          aria-label="উইশলিস্টে যোগ করুন"
        >
          <Heart
            className={`size-4 transition-all ${
              inWishlist || justWishlisted
                ? "fill-red-600 text-red-600 scale-110"
                : ""
            }`}
          />
          {inWishlist
            ? "উইশলিস্টে আছে"
            : justWishlisted
              ? "যোগ হয়েছে ✓"
              : "উইশলিস্ট"}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 transition-colors hover:text-red-600"
          aria-label="শেয়ার করুন"
        >
          <Share2 className="size-4" />
          শেয়ার করুন
        </button>
      </div>
    </>
  );
}
