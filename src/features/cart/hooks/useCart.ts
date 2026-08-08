"use client";

import { useAppStore } from "@/features/navigation/store/AppStoreContext";
/**
 * useCart is now a thin adapter over AppStore.
 * All state lives in AppStoreContext so it's shared app-wide.
 */
import { useState, useMemo } from "react";

export const useCart = () => {
  const {
    cart: items,
    cartCalc,
    updateQuantity,
    removeFromCart: removeItem,
    clearCart,
  } = useAppStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const applyCoupon = (code: string) => {
    if (code.trim().toUpperCase() === "DISCOUNT50") {
      setAppliedDiscount(50);
    } else {
      setAppliedDiscount(0);
    }
  };

  // Recalculate grand total with coupon applied on top of store calculations
  const adjustedGrandTotal = useMemo(
    () => Math.max(0, cartCalc.grandTotal - appliedDiscount),
    [cartCalc.grandTotal, appliedDiscount],
  );

  return {
    items,
    couponCode,
    setCouponCode,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    rawPrice: cartCalc.rawPrice,
    totalDiscount: cartCalc.totalDiscount + appliedDiscount,
    currentSubtotal: cartCalc.currentSubtotal,
    deliveryFee: cartCalc.deliveryFee,
    grandTotal: adjustedGrandTotal,
  };
};
