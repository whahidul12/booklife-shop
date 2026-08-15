"use client";

import React from "react";
import { Users, ArrowUp, MoreVertical } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const retentionData = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 50 },
  { month: "Mar", value: 30 },
  { month: "Apr", value: 60 },
  { month: "May", value: 40 },
  { month: "Jun", value: 80 },
  { month: "Jul", value: 65 },
  { month: "Aug", value: 90 },
];

interface ReturningClientsCardProps {
  retentionRate?: number;
  growthPct?: string;
}

export function ReturningClientsCard({
  retentionRate = 85,
  growthPct = "+5.2%",
}: ReturningClientsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full relative overflow-hidden transition-all hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D10A11] shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              Returning Clients
            </h3>
            <p className="text-xs text-slate-400">Customer retention rate</p>
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

      {/* Main Metric */}
      <div className="text-center my-auto py-6 z-10 flex flex-col items-center justify-center flex-1">
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          {retentionRate}%
        </h2>
        <p className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1 mt-2">
          <ArrowUp className="size-3.5" />
          <span>{growthPct} from last month</span>
        </p>
      </div>

      {/* Background Soft Area Chart */}
      <div className="absolute -bottom-2 left-0 right-0 h-28 pointer-events-none opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={retentionData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D10A11" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D10A11" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#D10A11"
              strokeWidth={2}
              fill="url(#retentionGrad)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
