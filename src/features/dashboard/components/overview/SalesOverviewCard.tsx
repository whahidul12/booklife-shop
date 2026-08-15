"use client";

import React from "react";
import { Tag } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DateRangePicker } from "./DateRangePicker";

const defaultSalesData = [
  { date: "01 Jan", sales: 75, orders: 35 },
  { date: "03 Jan", sales: 74, orders: 36 },
  { date: "05 Jan", sales: 34, orders: 62 },
  { date: "06 Jan", sales: 42, orders: 60 },
  { date: "08 Jan", sales: 82, orders: 16 },
  { date: "10 Jan", sales: 62, orders: 60 },
  { date: "12 Jan", sales: 38, orders: 38 },
  { date: "14 Jan", sales: 16, orders: 40 },
];

interface SalesOverviewCardProps {
  salesAmount?: string | number;
  activeOrders?: string | number;
}

export function SalesOverviewCard({
  salesAmount = "5,458",
  activeOrders = "1,254",
}: SalesOverviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
            <Tag className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Sales Overview
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Easily manage customer information and order updates while keeping sales records.
            </p>
          </div>
        </div>

        {/* Filter & Metric Badges Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <DateRangePicker align="left" />

          <div className="bg-red-50/60 border border-red-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sales Amount:</span>
            <span className="text-sm font-bold text-slate-900">{salesAmount}</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Active Orders:</span>
            <span className="text-sm font-bold text-slate-900">{activeOrders}</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[220px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={defaultSalesData}
            margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid stroke="#f8fafc" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                fontSize: "12px",
              }}
            />
            <Line
              name="Sales Amount"
              type="monotone"
              dataKey="sales"
              stroke="#D10A11"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#D10A11", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#D10A11", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Line
              name="Active Orders"
              type="monotone"
              dataKey="orders"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
