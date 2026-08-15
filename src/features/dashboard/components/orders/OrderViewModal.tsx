"use client";

import React, { useEffect, useState } from "react";
import { X, ShoppingBag, CheckSquare, Calendar, MapPin, Phone, CreditCard, Tag, PackageCheck, AlertCircle } from "lucide-react";
import { getOrderDetailsWithItemsAction } from "@/features/orders/actions/orders.actions";
import type { Order, OrderItem } from "@/db/schema";

interface OrderViewModalProps {
  order: Order;
  onClose: () => void;
  onEditStatus: () => void;
}

export function OrderViewModal({
  order,
  onClose,
  onEditStatus,
}: OrderViewModalProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const res = await getOrderDetailsWithItemsAction(order.id);
        if (res.data) {
          setItems(res.data.items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [order.id]);

  const subtotal = (order.subtotalPaisa / 100).toFixed(0);
  const delivery = (order.deliveryFeePaisa / 100).toFixed(0);
  const discount = (order.couponDiscountPaisa / 100).toFixed(0);
  const total = (order.totalPaisa / 100).toFixed(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <ShoppingBag className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Order Invoice #{order.id}</h3>
              <p className="text-xs text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Status & Payment Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Order Status</span>
              <span className="font-bold text-gray-900 uppercase">{order.status}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Payment Method</span>
              <span className="font-semibold text-gray-800 capitalize">
                {order.paymentMethod.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Payment Status</span>
              <span className="font-semibold text-gray-800 uppercase">{order.paymentStatus}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Grand Total</span>
              <span className="font-bold text-[#D10A13]">৳ {total}</span>
            </div>
          </div>

          {/* Shipping Address Snapshot & Delivery Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                <MapPin className="size-4 text-[#D10A13]" />
                <span>Shipping Address</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-mono bg-gray-50 p-2.5 rounded-lg">
                {order.shippingAddressSnapshot}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                <PackageCheck className="size-4 text-purple-600" />
                <span>Customer Delivery Note</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic bg-gray-50 p-2.5 rounded-lg min-h-[50px]">
                {order.deliveryNote || "No delivery instructions provided."}
              </p>
            </div>
          </div>

          {/* Itemized Purchased Books List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Ordered Items ({items.length})
            </h4>
            <div className="rounded-xl border border-gray-200/80 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5">Book Title</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Unit Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        Loading invoice items...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        No item records found for this order.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const itemUnit = (item.unitPricePaisa / 100).toFixed(0);
                      const itemTotal = ((item.unitPricePaisa * item.quantity) / 100).toFixed(0);
                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 font-medium text-gray-800">
                            Book ID: {item.bookId}
                          </td>
                          <td className="px-4 py-2.5 text-center font-semibold">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right text-gray-600">৳ {itemUnit}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-gray-900">৳ {itemTotal}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>৳ {delivery}</span>
            </div>
            {order.couponDiscountPaisa > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount:</span>
                <span>-৳ {discount}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
              <span>Total Payable:</span>
              <span className="text-[#D10A13]">৳ {total}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditStatus();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all"
          >
            <CheckSquare className="size-3.5" />
            <span>Update Order Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
