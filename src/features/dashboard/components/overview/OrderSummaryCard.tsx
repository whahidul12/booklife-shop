"use client";

import React from "react";
import { ShoppingBag, MoreVertical } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const orderSummaryData = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "New Order", value: 30, color: "#3b82f6" },
  { name: "Pending", value: 25, color: "#ef4444" },
];

interface OrderSummaryCardProps {
  completedCount?: number;
  newOrderCount?: number;
  pendingCount?: number;
}

export function OrderSummaryCard({
  completedCount,
  newOrderCount,
  pendingCount,
}: OrderSummaryCardProps) {
  let chartData = orderSummaryData;
  if (completedCount !== undefined && newOrderCount !== undefined && pendingCount !== undefined) {
    const total = completedCount + newOrderCount + pendingCount;
    if (total > 0) {
      chartData = [
        { name: "Completed", value: Math.round((completedCount / total) * 100), color: "#10b981" },
        { name: "New Order", value: Math.round((newOrderCount / total) * 100), color: "#3b82f6" },
        { name: "Pending", value: Math.round((pendingCount / total) * 100), color: "#ef4444" },
      ];
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full w-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Order Summary
            </h3>
            <p className="text-xs text-slate-400">Orders overview snapshot</p>
          </div>
        </div>
        {/* <button
          type="button"
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
          aria-label="Options"
        >
          <MoreVertical className="size-4" />
        </button> */}
      </div>

      {/* Donut Chart - centered and filling vertical space */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 my-auto min-h-[210px] relative w-full">
        <div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: any) => [`${val}%`, "Share"]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`order-summary-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400">Total Orders</span>
            <span className="text-lg font-bold text-slate-900">100%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-slate-50 text-xs mt-auto">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="size-2 rounded-full bg-blue-500" />
          <span>New Order</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="size-2 rounded-full bg-rose-500" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
}
