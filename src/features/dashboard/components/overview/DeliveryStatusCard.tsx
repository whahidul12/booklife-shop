"use client";

import React from "react";
import { Package } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

interface DeliveryMetrics {
  onTimeCount?: number;
  deliveredCount?: number;
  inTransitCount?: number;
  delayedCount?: number;
}

export function DeliveryStatusCard({
  onTimeCount = 1253,
  deliveredCount = 859,
  inTransitCount = 320,
  delayedCount = 320,
}: DeliveryMetrics) {
  const total = onTimeCount + deliveredCount + inTransitCount + delayedCount;
  const onTimePct = total > 0 ? Math.round((onTimeCount / total) * 100) : 25;
  const deliveredPct = total > 0 ? Math.round((deliveredCount / total) * 100) : 45;
  const inTransitPct = total > 0 ? Math.round((inTransitCount / total) * 100) : 15;
  const delayedPct = total > 0 ? Math.max(0, 100 - (onTimePct + deliveredPct + inTransitPct)) : 15;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D10A11] shrink-0">
            <Package className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Delivery Status
            </h3>
            <p className="text-xs text-slate-400">Delivery performance</p>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        <div className="mt-4">
          <DateRangePicker compact align="left" />
        </div>

        {/* Progress Bar & Percentage Labels */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5 px-0.5">
            <span>{onTimePct}%</span>
            <span>{deliveredPct}%</span>
            <span>{inTransitPct}%</span>
            <span>{delayedPct}%</span>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden gap-[2px] bg-slate-100">
            <div className="bg-blue-500 rounded-l-full transition-all duration-500" style={{ width: `${onTimePct}%` }} />
            <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${deliveredPct}%` }} />
            <div className="bg-amber-500 transition-all duration-500" style={{ width: `${inTransitPct}%` }} />
            <div className="bg-rose-500 rounded-r-full transition-all duration-500" style={{ width: `${delayedPct}%` }} />
          </div>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 mt-5 pt-3 border-t border-slate-50">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="size-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium">On-Time Delivery</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{onTimeCount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium">Delivered</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{deliveredCount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="size-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium">In Transit</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{inTransitCount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="size-2 rounded-full bg-rose-500" />
            <span className="text-xs font-medium">Delayed</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{delayedCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
