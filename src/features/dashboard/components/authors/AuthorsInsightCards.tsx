"use client";

import React from "react";
import { Feather, UserCheck, FileText, UserX } from "lucide-react";
import type { AuthorInsights, AuthorPhotoFilter } from "./types";

interface AuthorsInsightCardsProps {
  insights: AuthorInsights;
  activeStatus: AuthorPhotoFilter;
  onSelectFilter: (status: AuthorPhotoFilter) => void;
}

export function AuthorsInsightCards({
  insights,
  activeStatus,
  onSelectFilter,
}: AuthorsInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Authors",
      count: insights.total.toLocaleString(),
      icon: Feather,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "Entire author roster",
    },
    {
      id: "has_photo" as const,
      label: "With Portrait Photo",
      count: insights.withPhoto.toLocaleString(),
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "High fidelity profiles",
    },
    {
      id: "bio" as const,
      label: "With Full Biography",
      count: insights.withBio.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      activeRing: "",
      subtext: "Biographical details present",
      isStatOnly: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = !card.isStatOnly && activeStatus === card.id;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (!card.isStatOnly) {
                onSelectFilter(card.id as AuthorPhotoFilter);
              }
            }}
            className={`group relative flex items-center justify-between rounded-2xl border bg-white p-4.5 shadow-sm transition-all duration-200 ${
              card.isStatOnly ? "cursor-default border-gray-200/70" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
            } ${
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
