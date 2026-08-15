"use client";

import React from "react";
import { Presentation, LayoutTemplate, Grid2X2, CheckCircle2 } from "lucide-react";
import type { BannerInsights, BannerTypeFilter } from "./types";

interface BannersInsightCardsProps {
  insights: BannerInsights;
  activeType: BannerTypeFilter;
  onSelectType: (type: BannerTypeFilter) => void;
}

export function BannersInsightCards({
  insights,
  activeType,
  onSelectType,
}: BannersInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Banners",
      count: insights.total.toLocaleString(),
      icon: Presentation,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: `${insights.activeCount} currently live`,
    },
    {
      id: "hero" as const,
      label: "Hero Carousel",
      count: insights.heroCount.toLocaleString(),
      icon: LayoutTemplate,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      activeRing: "ring-2 ring-purple-500",
      subtext: "Top homepage hero sliders",
    },
    {
      id: "category" as const,
      label: "Category Banners",
      count: insights.categoryCount.toLocaleString(),
      icon: Grid2X2,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Collection promotion cards",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeType === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectType(card.id)}
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
