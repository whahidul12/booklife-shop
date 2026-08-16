"use client";

import React from "react";
import { MessageSquare, Star, Eye, EyeOff } from "lucide-react";
import type { ReviewInsights, ReviewStatusFilter } from "./types";

interface ReviewsInsightCardsProps {
  insights: ReviewInsights;
  activeStatus: ReviewStatusFilter;
  //onSelectFilter: (status: ReviewStatusFilter) => void;
}

export function ReviewsInsightCards({
  insights,
  activeStatus,
  //onSelectFilter,
}: ReviewsInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Reviews",
      count: insights.total.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "All customer ratings",
    },
    {
      id: "avg" as const,
      label: "Average Rating",
      count: `${insights.avgRating.toFixed(1)} ★`,
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      activeRing: "",
      subtext: `${insights.fiveStarCount} perfect 5-star ratings`,
      isStatOnly: true,
    },
    {
      id: "visible" as const,
      label: "Visible Reviews",
      count: insights.visibleCount.toLocaleString(),
      icon: Eye,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Published on store",
    },
    {
      id: "hidden" as const,
      label: "Hidden / Flagged",
      count: insights.hiddenCount.toLocaleString(),
      icon: EyeOff,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Moderated or suppressed",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = !card.isStatOnly && activeStatus === card.id;

        return (
          <div
            key={card.id}
            // onClick={() => {
            //   if (!card.isStatOnly) {
            //     onSelectFilter(card.id as ReviewStatusFilter);
            //   }
            // }}
            className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 
              ${isSelected ? `bg-linear-to-b from-brand/10 to-white border-brand` : "border-gray-200/70 hover:border-gray-300 bg-white"
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
