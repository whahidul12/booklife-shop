"use client";

import React from "react";
import { BookOpen, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { BookInsights, BookStatusFilter } from "./types";

interface BooksInsightCardsProps {
  insights: BookInsights;
  activeStatus: BookStatusFilter;
  //onSelectFilter: (status: BookStatusFilter) => void;
}

export function BooksInsightCards({
  insights,
  activeStatus,
  //onSelectFilter,
}: BooksInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Products",
      count: insights.total,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "Entire catalog items",
    },
    {
      id: "in_stock" as const,
      label: "In Stock Products",
      count: insights.inStock,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Available for purchase",
    },
    {
      id: "low_stock" as const,
      label: "Low Stock Products",
      count: insights.lowStock,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      activeRing: "ring-2 ring-amber-500",
      subtext: "Stock count ≤ 5",
    },
    {
      id: "out_of_stock" as const,
      label: "Out of Stock Products",
      count: insights.outOfStock,
      icon: XCircle,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Requires immediate restock",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {card.count.toLocaleString()}
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
