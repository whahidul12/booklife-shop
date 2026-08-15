"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DateRangePicker } from "./DateRangePicker";

const paymentData = [
  { name: "Visa", value: 20, color: "#1d4ed8" },
  { name: "Strips", value: 20, color: "#f59e0b" },
  { name: "Google Pay", value: 15, color: "#ef4444" },
  { name: "PayPal", value: 20, color: "#3b82f6" },
  { name: "Apple Pay", value: 25, color: "#0ea5e9" },
];

export function PaymentMethodsCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <CreditCard className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Payment Methods
            </h3>
            <p className="text-xs text-slate-400">Customer most used payment options</p>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        <div className="mt-4">
          <DateRangePicker compact align="left" />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="relative w-full aspect-square max-w-[190px] mx-auto my-auto py-2 flex items-center justify-center flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(val: any) => [`${val}%`, "Share"]}
              contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
            />
            <Pie
              data={paymentData}
              cx="50%"
              cy="50%"
              outerRadius={75}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {paymentData.map((entry, index) => (
                <Cell key={`pay-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-x-3.5 gap-y-2 mt-auto pt-3 border-t border-slate-50 text-xs">
        {paymentData.map((p, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
