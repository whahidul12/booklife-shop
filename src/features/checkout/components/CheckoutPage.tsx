"use client";

import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { AddressCard } from "./AddressCard";
import { AddAddressCard } from "./AddAddressCard";
import { DeliveryNoteSection } from "./DeliveryNoteSection";
import { OrderSummary } from "./OrderSummary";
import { PaymentSection } from "./PaymentSection";
import { OrderConfirmationModal } from "./OrderConfirmationModal";
import Link from "next/link";
import { useAppStore } from "@/features/navigation/store/AppStoreContext";

export function CheckoutPage() {
  const { cart, addresses } = useAppStore();
  const { state, actions } = useCheckoutForm();

  const giftWrapFee = state.isGiftWrapped ? 30 : 0;

  /* Empty cart guard */
  if (cart.length === 0 && !state.confirmedOrder) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-gray-600">
          আপনার কার্ট খালি। প্রথমে বই যোগ করুন।
        </p>
        <Link
          href="/"
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Order confirmation modal */}
      {state.confirmedOrder && (
        <OrderConfirmationModal
          order={state.confirmedOrder}
          onClose={actions.clearConfirmedOrder}
        />
      )}

      <form
        onSubmit={actions.handleSubmit}
        className="mx-auto min-h-screen max-w-6xl bg-[#fafafa] p-4 md:p-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column — Delivery details */}
          <div className="flex flex-col lg:col-span-7 xl:col-span-8">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              ডেলিভারি ঠিকানা
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  name={addr.name}
                  location={addr.location}
                  addressLine={addr.addressLine}
                  phone={addr.phone}
                  isActive={state.selectedAddressId === addr.id}
                  onClick={() => actions.setSelectedAddressId(addr.id)}
                />
              ))}
              <AddAddressCard />
            </div>

            <DeliveryNoteSection
              note={state.note}
              isGiftWrapped={state.isGiftWrapped}
              shipToDifferentAddress={state.shipToDifferentAddress}
              onNoteChange={actions.setNote}
              onGiftWrapChange={actions.setIsGiftWrapped}
              onShipDifferentChange={actions.setShipToDifferentAddress}
            />

            {state.error && (
              <p className="mb-4 rounded bg-red-50 p-3 text-sm font-medium text-red-600">
                {state.error}
              </p>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={cart.length === 0 || state.submitting}
              >
                {state.submitting ? "অর্ডার প্রক্রিয়াকরণ হচ্ছে..." : "অর্ডার সাবমিট করুন"}
              </button>
            </div>
          </div>

          {/* Right Column — Summary & Payment */}
          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            <OrderSummary
              extraFee={giftWrapFee}
              couponDiscount={state.couponDiscount}
            />
            <PaymentSection
              selectedMethod={state.paymentMethod}
              onMethodSelect={actions.setPaymentMethod}
            />
          </div>
        </div>
      </form>
    </>
  );
}
