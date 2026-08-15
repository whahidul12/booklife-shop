"use client";

import React from "react";
import { Smile, Star } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

const ratingBreakdown = [
  { stars: 5, pct: 90 },
  { stars: 4, pct: 75 },
  { stars: 3, pct: 67 },
  { stars: 2, pct: 44 },
  { stars: 1, pct: 21 },
];

export function CustomerSatisfactionCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Smile className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Customer Satisfaction
            </h3>
            <p className="text-xs text-slate-400">Track ratings and feedback trends.</p>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        <div className="mt-4">
          <DateRangePicker compact align="left" />
        </div>

        {/* Score & Stars Display */}
        <div className="flex items-end gap-3 mt-4 mb-5">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-none">
            4.9<span className="text-lg font-normal text-slate-400">/5</span>
          </h2>
          <div className="pb-0.5">
            <div className="flex items-center gap-0.5 text-amber-400 mb-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400/40 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Based on 25,847 reviews</p>
          </div>
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="space-y-2.5 pt-3 border-t border-slate-50 mt-auto">
        {ratingBreakdown.map((row) => (
          <div key={row.stars} className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 w-6 text-slate-500 font-medium">
              <Star className="size-3 text-slate-400" />
              <span>{row.stars}</span>
            </div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <span className="w-8 text-right font-medium text-slate-400">{row.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
