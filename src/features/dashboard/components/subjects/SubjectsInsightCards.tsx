"use client";

import React from "react";
import { Bookmark, CheckCircle2, XCircle, LayoutGrid } from "lucide-react";
import type { SubjectInsights, SubjectStatusFilter } from "./types";

interface SubjectsInsightCardsProps {
  insights: SubjectInsights;
  activeStatus: SubjectStatusFilter;
  onSelectFilter: (status: SubjectStatusFilter) => void;
}

export function SubjectsInsightCards({
  insights,
  activeStatus,
  onSelectFilter,
}: SubjectsInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Subjects",
      count: insights.total.toLocaleString(),
      icon: LayoutGrid,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "Entire subject taxonomy",
    },
    {
      id: "active" as const,
      label: "Active Subjects",
      count: insights.activeCount.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Live on storefront navigation",
    },
    {
      id: "inactive" as const,
      label: "Inactive / Hidden",
      count: insights.inactiveCount.toLocaleString(),
      icon: XCircle,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Hidden from customer filters",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? `${card.activeRing} border-transparent` : "border-gray-200/70 hover:border-gray-300"
            }`}
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {card.count}
              </h3>
              <p className="text-[11px] text-gray-400">{card.subtext}</p>
            </div>

            <div
              className={`flex size-11 items-center justify-center rounded-xl border ${card.bgColor} ${card.borderColor} ${card.color} transition-transform group-hover:scale-105`}
            >
              <Icon className="size-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
