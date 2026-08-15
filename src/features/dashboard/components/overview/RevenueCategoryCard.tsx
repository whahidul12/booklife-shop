"use client";

import React from "react";
import { Tag, MoreVertical } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const categoryData = [
  { name: "Fashion", value: 20, color: "#D10A11" },
  { name: "Beauty", value: 15, color: "#ef4444" },
  { name: "Medical", value: 15, color: "#3b82f6" },
  { name: "Sports", value: 20, color: "#8b5cf6" },
  { name: "Electronics", value: 15, color: "#10b981" },
  { name: "Furniture", value: 15, color: "#f59e0b" },
];

interface RevenueCategoryCardProps {
  categories?: { name: string; value: number; color?: string }[];
  totalProductsCount?: string;
}

export function RevenueCategoryCard({
  categories,
  totalProductsCount = "25.59K",
}: RevenueCategoryCardProps) {
  const chartData = categories && categories.length > 0 ? categories : categoryData;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between flex-1 h-full w-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Tag className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Revenue by Category
            </h3>
            <p className="text-xs text-slate-400">Revenue breakdown</p>
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

      {/* Semi-Circle / Gauge Chart - centered and filling vertical space */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 my-auto min-h-[210px] relative w-full">
        <div className="relative w-full aspect-[2/1] max-w-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: any) => [`${val}%`, "Share"]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="95%"
                startAngle={180}
                endAngle={0}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cat-cell-${index}`} fill={entry.color || "#D10A11"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label below arch */}
          <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center text-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400">Total Products</span>
            <span className="text-xl font-bold text-slate-900 leading-tight">
              {totalProductsCount}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Category Items Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50 text-[11px] mt-auto">
        {chartData.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: cat.color || "#D10A11" }}
            />
            <span className="truncate">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
