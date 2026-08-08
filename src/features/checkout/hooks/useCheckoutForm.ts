"use client";

import { useState } from "react";
import type { Order } from "@/features/navigation/store/types";
import { useAppStore } from "@/features/navigation/store/AppStoreContext";
import { placeOrderAction } from "@/features/orders/actions/orders.actions";
import { useRouter } from "next/navigation";

export function useCheckoutForm() {
  const router = useRouter();
  const { cart, placeOrder, clearCart, cartCalc, addresses } = useAppStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id ?? "default",
  );
  const [note, setNote] = useState<string>("");
  const [isGiftWrapped, setIsGiftWrapped] = useState<boolean>(false);
  const [shipToDifferentAddress, setShipToDifferentAddress] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash_on_delivery");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const giftWrapFee = isGiftWrapped ? 30 : 0;
  const grandTotal = cartCalc.grandTotal + giftWrapFee - couponDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setError(null);

    // Call DB Server Action
    const res = await placeOrderAction({
      addressId: selectedAddressId || "default",
      paymentMethod,
      deliveryNote: note,
      items: cart.map((item) => ({
        bookId: item.id,
        bookNameSnapshot: item.title,
        quantity: item.quantity,
        unitPricePaisa: item.originalPrice * 100,
        discountPricePaisa: item.currentPrice * 100,
      })),
    });

    if (res.error) {
      setError(res.error);
      setSubmitting(false);
      return;
    }

    // Also update local optimistic state
    const order = placeOrder(paymentMethod, note, couponDiscount - giftWrapFee);
    if (res.data?.orderId) {
      order.id = res.data.orderId;
    }
    clearCart();
    setConfirmedOrder(order);
    setSubmitting(false);
  };

  const clearConfirmedOrder = () => setConfirmedOrder(null);

  return {
    state: {
      selectedAddressId,
      note,
      isGiftWrapped,
      shipToDifferentAddress,
      paymentMethod,
      couponDiscount,
      grandTotal,
      confirmedOrder,
      submitting,
      error,
    },
    actions: {
      setSelectedAddressId,
      setNote,
      setIsGiftWrapped,
      setShipToDifferentAddress,
      setPaymentMethod,
      setCouponDiscount,
      handleSubmit,
      clearConfirmedOrder,
    },
  };
}
