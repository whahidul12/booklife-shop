"use client";

import React from "react";
import { CartHeader } from "./CartHeader";
import { CartItemList } from "./CartItemList";
import { CartSummary } from "./CartSummary";
import { CheckoutButton } from "./CheckoutButton";
import { useCart } from "../hooks/useCart";

export const CartContainer: React.FC = () => {
  const {
    items,
    couponCode,
    setCouponCode,
    clearCart,
    applyCoupon,
    rawPrice,
    totalDiscount,
    currentSubtotal,
    deliveryFee,
    grandTotal,
  } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Cart Items */}
        <div className="flex flex-col justify-between lg:col-span-8">
          <div>
            <CartHeader onClearAll={clearCart} hasItems={items.length > 0} />
            <CartItemList items={items} />
          </div>
          <CheckoutButton disabled={items.length === 0} />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            rawPrice={rawPrice}
            totalDiscount={totalDiscount}
            currentSubtotal={currentSubtotal}
            deliveryFee={deliveryFee}
            grandTotal={grandTotal}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            onApplyCoupon={applyCoupon}
          />
        </div>
      </div>
    </div>
  );
};
