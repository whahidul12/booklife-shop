"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";

// Revenue Sparkline Bar Data
const revenueBarData = [
  { day: "1", value: 30, highlight: false },
  { day: "2", value: 45, highlight: false },
  { day: "3", value: 35, highlight: false },
  { day: "4", value: 50, highlight: false },
  { day: "5", value: 40, highlight: false },
  { day: "6", value: 80, highlight: true },
  { day: "7", value: 20, highlight: false },
];

// Conversion Rate Donut Data
const conversionPieData = [
  { name: "Converted", value: 35.5, fill: "#D10A11" },
  { name: "Remaining", value: 64.5, fill: "#f1f5f9" },
];

// Orders Sparkline Line Data
const ordersLineData = [
  { index: 1, value: 10 },
  { index: 2, value: 40 },
  { index: 3, value: 20 },
  { index: 4, value: 60 },
  { index: 5, value: 30 },
  { index: 6, value: 70 },
  { index: 7, value: 40 },
  { index: 8, value: 50 },
];

// Customers Sparkline Bar Data
const customersBarData = [
  { day: "1", value: 40 },
  { day: "2", value: 30 },
  { day: "3", value: 50 },
  { day: "4", value: 80 },
  { day: "5", value: 40 },
  { day: "6", value: 70 },
  { day: "7", value: 50 },
];

interface KpiStatCardsProps {
  revenue?: number;
  totalOrders?: number;
  totalCustomers?: number;
  conversionRate?: number;
}

export function KpiStatCards({
  revenue,
  totalOrders,
  totalCustomers,
  conversionRate = 35.5,
}: KpiStatCardsProps) {
  const displayRevenue =
    revenue !== undefined
      ? `$${Math.round(revenue / 100).toLocaleString()}`
      : "$124,563";

  const displayOrders =
    totalOrders !== undefined
      ? totalOrders.toLocaleString()
      : "18,425";

  const displayCustomers =
    totalCustomers !== undefined
      ? totalCustomers.toLocaleString()
      : "58,426";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 h-full md:grid-rows-2">
      {/* 1. Total Revenue Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
          {/* <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            aria-label="Options"
          >
            <MoreVertical className="size-4" />
          </button> */}
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {displayRevenue}
            </h2>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUp className="size-3.5" />
              <span>92.4% Avg</span>
            </p>
          </div>
          <div className="w-20 h-11">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={6}>
                  {revenueBarData.map((entry, index) => (
                    <Cell
                      key={`rev-bar-${index}`}
                      fill={entry.highlight ? "#D10A11" : "rgba(209, 10, 17, 0.22)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Total Orders Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Total Orders</h3>
          {/* <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            aria-label="Options"
          >
            <MoreVertical className="size-4" />
          </button> */}
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {displayOrders}
            </h2>
            <p className="text-xs font-semibold text-amber-500 flex items-center gap-1 mt-1">
              <ArrowUpDown className="size-3.5" />
              <span>60.2% Avg</span>
            </p>
          </div>
          <div className="w-24 h-11">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersLineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Conversion Rate Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Conversion Rate</h3>
          {/* <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            aria-label="Options"
          >
            <MoreVertical className="size-4" />
          </button> */}
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {conversionRate}%
            </h2>
            <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
              <ArrowDown className="size-3.5" />
              <span>09.4% Avg</span>
            </p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {conversionPieData.map((entry, index) => (
                    <Cell key={`conv-cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#D10A11]">
              35.5%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Total Customers Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500">Total Customers</h3>
          {/* <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            aria-label="Options"
          >
            <MoreVertical className="size-4" />
          </button> */}
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {displayCustomers}
            </h2>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowDownRight className="size-3.5 rotate-[-90deg]" />
              <span>44.7% Avg</span>
            </p>
          </div>
          <div className="w-20 h-11">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customersBarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Bar dataKey="value" fill="#10b981" radius={[3, 3, 0, 0]} barSize={5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
