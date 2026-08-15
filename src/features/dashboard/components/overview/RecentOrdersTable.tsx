"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import type { RecentOrder } from "../../actions/analytics.actions";
import { DateRangePicker, DateRange } from "./DateRangePicker";

interface OrderRowItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAvatar: string;
  createdAt: string;
  timeStr: string;
  total: string;
  profit: string;
  status: "Shipped" | "Pending" | "Rejected" | "Confirmed" | "Delivered";
}

const fallbackOrders: OrderRowItem[] = [
  {
    id: "1",
    orderNumber: "INV-1002",
    customerName: "Theresa Webb",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    createdAt: "13 Aug, 24",
    timeStr: "04:02 am",
    total: "$ 839",
    profit: "$ 830.92",
    status: "Shipped",
  },
  {
    id: "2",
    orderNumber: "INV-1004",
    customerName: "Jerome Bell",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    createdAt: "22 Nov, 24",
    timeStr: "01:55 pm",
    total: "$ 74.03",
    profit: "$ 783.83",
    status: "Pending",
  },
  {
    id: "3",
    orderNumber: "INV-1005",
    customerName: "Guy Hawkins",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    createdAt: "22 Apr, 25",
    timeStr: "06:42 am",
    total: "$ 4500",
    profit: "$ 839",
    status: "Rejected",
  },
  {
    id: "4",
    orderNumber: "INV-1006",
    customerName: "Wade Warren",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    createdAt: "13 Aug, 24",
    timeStr: "04:02 am",
    total: "$ 73.02",
    profit: "$ 74.03",
    status: "Rejected",
  },
  {
    id: "5",
    orderNumber: "INV-1007",
    customerName: "Jacob Jones",
    customerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    createdAt: "13 Aug, 24",
    timeStr: "04:02 am",
    total: "$ 73.02",
    profit: "$ 74.03",
    status: "Confirmed",
  },
];

const statusStyles: Record<string, string> = {
  Shipped: "text-blue-600 bg-blue-50/70 border border-blue-200/60",
  Pending: "text-amber-600 bg-amber-50/70 border border-amber-200/60",
  Rejected: "text-rose-600 bg-rose-50/70 border border-rose-200/60",
  Confirmed: "text-emerald-600 bg-emerald-50/70 border border-emerald-200/60",
  Delivered: "text-emerald-600 bg-emerald-50/70 border border-emerald-200/60",
};

interface RecentOrdersTableProps {
  realOrders?: RecentOrder[];
}

export function RecentOrdersTable({ realOrders }: RecentOrdersTableProps) {
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-order-menu]")) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  // Map real backend orders if available, otherwise use fallback
  const [ordersList, setOrdersList] = useState<OrderRowItem[]>(fallbackOrders);

  useEffect(() => {
    if (realOrders && realOrders.length > 0) {
      setOrdersList(
        realOrders.map((o, idx) => {
          const dateObj = new Date(o.createdAt);
          const dateStr = dateObj.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          });
          const timeStr = dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          let st: OrderRowItem["status"] = "Pending";
          if (o.status === "shipped") st = "Shipped";
          else if (o.status === "delivered") st = "Delivered";
          else if (o.status === "confirmed") st = "Confirmed";
          else if (o.status === "cancelled") st = "Rejected";

          const totalNum = o.totalPaisa / 100;
          const profitNum = totalNum * 0.15;

          return {
            id: o.id,
            orderNumber: `INV-${1000 + idx + 1}`,
            customerName: o.recipientName || "Customer",
            customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.recipientName || o.id)}`,
            createdAt: dateStr,
            timeStr: timeStr.toLowerCase(),
            total: `$ ${totalNum.toFixed(totalNum % 1 === 0 ? 0 : 2)}`,
            profit: `$ ${profitNum.toFixed(2)}`,
            status: st,
          };
        })
      );
    }
  }, [realOrders]);

  const handleAction = (action: "view" | "edit" | "delete", order: OrderRowItem) => {
    setOpenMenuId(null);
    if (action === "delete") {
      setOrdersList((prev) => prev.filter((o) => o.id !== order.id));
    } else if (action === "view") {
      alert(`Viewing details for Order ${order.orderNumber} (${order.customerName})`);
    } else if (action === "edit") {
      alert(`Editing Order ${order.orderNumber}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D10A11] shrink-0">
            <ShoppingCart className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-400">
              Latest customer orders with status, payment, and totals
            </p>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        <div className="self-start sm:self-auto">
          <DateRangePicker align="right" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5 flex-1">
        <table className="w-full text-xs text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold">
              <th className="pb-3 pr-4 font-semibold">
                <span className="flex items-center gap-1">
                  Order ID <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 px-4 font-semibold">
                <span className="flex items-center gap-1">
                  Customer <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 px-4 font-semibold">
                <span className="flex items-center gap-1">
                  Create <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 px-4 font-semibold">
                <span className="flex items-center gap-1">
                  Total <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 px-4 font-semibold">
                <span className="flex items-center gap-1">
                  Profit <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 px-4 font-semibold">
                <span className="flex items-center gap-1">
                  Status <ArrowUpDown className="size-3 text-slate-300" />
                </span>
              </th>
              <th className="pb-3 pl-4 text-center font-semibold">Act.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ordersList.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                <td className={`font-semibold text-slate-900 pr-4 ${dense ? "py-2.5" : "py-3.5"}`}>
                  {row.orderNumber}
                </td>
                <td className={`px-4 ${dense ? "py-2.5" : "py-3.5"}`}>
                  <div className="flex items-center gap-2.5">
                    {/* Customer Avatar */}
                    <div className="relative size-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={row.customerAvatar}
                        alt={row.customerName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className="font-medium text-slate-800">{row.customerName}</span>
                  </div>
                </td>
                <td className={`px-4 text-slate-500 leading-snug ${dense ? "py-2.5" : "py-3.5"}`}>
                  <div>{row.createdAt}</div>
                  <div className="text-[11px] text-slate-400">{row.timeStr}</div>
                </td>
                <td className={`px-4 font-semibold text-slate-800 ${dense ? "py-2.5" : "py-3.5"}`}>
                  {row.total}
                </td>
                <td className={`px-4 font-semibold text-slate-800 ${dense ? "py-2.5" : "py-3.5"}`}>
                  {row.profit}
                </td>
                <td className={`px-4 ${dense ? "py-2.5" : "py-3.5"}`}>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                      statusStyles[row.status] || "text-slate-600 bg-slate-100"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className={`pl-4 text-center relative ${dense ? "py-2.5" : "py-3.5"}`}>
                  <div className="relative inline-block text-left" data-order-menu>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        openMenuId === row.id
                          ? "bg-slate-200/80 text-slate-900"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                      aria-label="Order Actions"
                    >
                      <MoreVertical className="size-4" />
                    </button>

                    {/* Dropdown Menu (View, Edit, Delete) */}
                    {openMenuId === row.id && (
                      <div className="absolute right-0 top-full mt-1 z-30 w-36 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => handleAction("view", row)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 transition-colors text-slate-700 hover:text-slate-900"
                        >
                          <Eye className="size-3.5 text-blue-500" />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction("edit", row)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 transition-colors text-slate-700 hover:text-slate-900"
                        >
                          <Edit3 className="size-3.5 text-amber-500" />
                          <span>Edit Order</span>
                        </button>
                        <div className="h-[1px] bg-slate-100 my-1" />
                        <button
                          type="button"
                          onClick={() => handleAction("delete", row)}
                          className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 transition-colors text-red-600 font-semibold"
                        >
                          <Trash2 className="size-3.5 text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
        {/* Dense Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={dense}
              onChange={(e) => setDense(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#D10A11]" />
          </div>
          <span className="font-medium text-slate-600">Dense</span>
        </label>

        {/* Rows per page & Pagination */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <div className="relative inline-block">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="appearance-none bg-transparent font-semibold text-slate-800 pr-4 focus:outline-none cursor-pointer"
              >
                <option value={11}>11</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
            </div>
          </div>

          <span>1-{ordersList.length} of 1000</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="size-7 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="size-7 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
