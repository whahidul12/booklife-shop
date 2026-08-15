"use client";

import React, { useState } from "react";
import { Copy, Check, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, ChevronDown } from "lucide-react";
import type { Order } from "@/db/schema";
import type { OrderStatus } from "./types";
import { OrderActionMenu } from "./OrderActionMenu";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewOrder: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
}

export function OrdersTable({
  orders,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewOrder,
  onEditStatus,
  onDeleteOrder,
}: OrdersTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allSelected = orders.length > 0 && selectedIds.length === orders.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < orders.length;

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-100">
            <Clock className="size-3" /> Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
            <CheckCircle2 className="size-3" /> Confirmed
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-100">
            <Truck className="size-3" /> Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="size-3" /> Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
            <XCircle className="size-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-100 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-semibold text-gray-600">Order ID</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Order Date</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Total (৳)</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Payment</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-28 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-24 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <ShoppingBag className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No orders found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query, status, or date range filters.
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                const totalTaka = (order.totalPaisa / 100).toFixed(0);

                return (
                  <tr
                    key={order.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(order.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Order ID Tag */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => onViewOrder(order)}
                          className="font-mono font-bold text-xs text-gray-900 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-[#D10A13] hover:text-[#D10A13] cursor-pointer transition-colors"
                        >
                          #{order.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyOrderId(order.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title="Copy Order ID"
                        >
                          {copiedId === order.id ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Order Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      <span className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-3.5 font-bold text-gray-900 text-xs">
                      ৳ {totalTaka}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700 border border-gray-200 capitalize">
                        {order.paymentMethod.replace("_", " ")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">{getStatusBadge(order.status)}</td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <OrderActionMenu
                        order={order}
                        onView={onViewOrder}
                        onEditStatus={onEditStatus}
                        onDelete={onDeleteOrder}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
