"use client";

import { useAppStore } from "@/features/navigation/store/AppStoreContext";
import { toBengaliNumber } from "@/utils/formatters";

interface OrderSummaryProps {
  /** Extra fees on top of store calculation (e.g. gift wrap) */
  extraFee?: number;
  /** Coupon discount to subtract */
  couponDiscount?: number;
}

export function OrderSummary({
  extraFee = 0,
  couponDiscount = 0,
}: OrderSummaryProps) {
  const { cartCalc, cart } = useAppStore();

  const grandTotal = Math.max(
    0,
    cartCalc.currentSubtotal + cartCalc.deliveryFee + extraFee - couponDiscount,
  );

  if (cart.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-400">
        কার্টে কোনো পণ্য নেই।
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded border border-gray-200 bg-white p-5 text-sm">
      <h3 className="font-semibold text-gray-700 mb-1">অর্ডার সারসংক্ষেপ</h3>

      {/* Items */}
      <div className="space-y-2 border-b border-gray-100 pb-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-600">
            <span className="line-clamp-1 max-w-[65%]">
              {item.title}{" "}
              <span className="text-gray-400">
                ×{toBengaliNumber(item.quantity)}
              </span>
            </span>
            <span>{toBengaliNumber(item.currentPrice * item.quantity)}৳</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>মোট দাম</span>
          <span>{toBengaliNumber(cartCalc.currentSubtotal)}৳</span>
        </div>
        {cartCalc.totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>ছাড়</span>
            <span>-{toBengaliNumber(cartCalc.totalDiscount)}৳</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>ডেলিভারি ফি</span>
          <span>{toBengaliNumber(cartCalc.deliveryFee)}৳</span>
        </div>
        {extraFee > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>গিফট র‍্যাপ</span>
            <span>+{toBengaliNumber(extraFee)}৳</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>কুপন ছাড়</span>
            <span>-{toBengaliNumber(couponDiscount)}৳</span>
          </div>
        )}
      </div>

      <hr className="border-gray-100" />
      <div className="flex items-center justify-between font-bold text-gray-900">
        <span>সর্বমোট</span>
        <span className="text-red-600">{toBengaliNumber(grandTotal)}৳</span>
      </div>
    </div>
  );
}
