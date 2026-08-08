import React from "react";
import { CartItemCard } from "./CartItemCard";
import type { CartItem } from "@/features/navigation/store/types";

interface CartItemListProps {
  items: CartItem[];
}

export const CartItemList: React.FC<CartItemListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400 text-lg mb-2">আপনার শপিং ব্যাগ খালি</p>
        <p className="text-gray-400 text-sm">পছন্দের বই যোগ করুন</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
