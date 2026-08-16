"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Calendar as CalendarIcon,
  Download,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { DateRangePicker, type DateRange } from "./DateRangePicker";

interface OverviewHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  lastUpdated?: Date | null;
}

export function OverviewHeader({
  loading,
  onRefresh,
  dateRange,
  onDateRangeChange,
  lastUpdated,
}: OverviewHeaderProps) {
  const [downloadToast, setDownloadToast] = useState(false);

  const handleExport = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  return (
    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Live Status */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100 shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Analytics
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Monitor sales volume, fulfillment pipeline, book category performance, and customer retention.
        </p>
      </div>

      {/* Interactive Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          align="right"
        />

        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          title={`Last updated at ${formattedTime}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 disabled:opacity-60"
        >
          <RefreshCw
            className={`size-3.5 ${loading ? "animate-spin text-[#D10A13]" : "text-gray-500"}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Export Summary Button */}
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all active:scale-95 hover:shadow-md hover:shadow-red-500/20"
        >
          <Download className="size-3.5 stroke-[2.5]" />
          <span>Export</span>
        </button>
      </div>

      {/* Export Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
          <p className="text-xs font-semibold text-gray-800">
            Analytics summary report downloaded.
          </p>
        </div>
      )}
    </div>
  );
}
