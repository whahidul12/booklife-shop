import React from "react";
import { Info } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";

interface CartSummaryProps {
  rawPrice: number;
  totalDiscount: number;
  currentSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onApplyCoupon: (code: string) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  rawPrice,
  totalDiscount,
  currentSubtotal,
  deliveryFee,
  grandTotal,
  couponCode,
  onCouponChange,
  onApplyCoupon,
}) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-xs">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">অর্ডার সারসংক্ষেপ</h3>

      {/* Price breakdown */}
      <div className="flex flex-col space-y-4 border-b border-gray-100 pb-4 text-sm text-gray-700">
        <div className="flex items-center justify-between">
          <span>দাম</span>
          <span>{toBengaliNumber(rawPrice)}৳</span>
        </div>
        <div className="flex items-center justify-between text-green-600">
          <span>ছাড়</span>
          <span>-{toBengaliNumber(totalDiscount)}৳</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-1 font-medium">
          <span>মোট দাম</span>
          <span>{toBengaliNumber(currentSubtotal)}৳</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>ডেলিভারি ফি</span>
            <Info className="h-3.5 w-3.5 cursor-pointer text-gray-400" />
          </div>
          <span>{toBengaliNumber(deliveryFee)}৳</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between py-4 text-base font-bold text-gray-900">
        <span>সর্বমোট</span>
        <span className="text-red-600">{toBengaliNumber(grandTotal)}৳</span>
      </div>

      {/* Coupon */}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="কুপন কোড লিখুন"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none placeholder:text-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <button
          onClick={() => onApplyCoupon(couponCode)}
          className="whitespace-nowrap rounded-md bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
        >
          Apply
        </button>
      </div>
      <p className="mt-2 text-[11px] text-gray-400">
        কুপন কোড ব্যবহার করুন: <span className="font-medium text-gray-500">DISCOUNT50</span>
      </p>
    </div>
  );
};
