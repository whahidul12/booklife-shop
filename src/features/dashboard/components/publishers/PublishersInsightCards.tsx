"use client";

import React from "react";
import { Building2, Image as ImageIcon, ImageOff, CheckCircle2 } from "lucide-react";
import type { PublisherInsights, PublisherLogoFilter } from "./types";

interface PublishersInsightCardsProps {
  insights: PublisherInsights;
  activeStatus: PublisherLogoFilter;
  //onSelectFilter: (status: PublisherLogoFilter) => void;
}

export function PublishersInsightCards({
  insights,
  activeStatus,
  //onSelectFilter,
}: PublishersInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Publishers",
      count: insights.total.toLocaleString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "Entire publication directory",
    },
    {
      id: "has_logo" as const,
      label: "With Official Logo",
      count: insights.withLogo.toLocaleString(),
      icon: ImageIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Branded partner publishers",
    },
    {
      id: "no_logo" as const,
      label: "Without Logo",
      count: insights.withoutLogo.toLocaleString(),
      icon: ImageOff,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Missing brand artwork",
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
            //onClick={() => onSelectFilter(card.id)}
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
