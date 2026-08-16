"use client";

import React from "react";
import { Ticket, CheckCircle2, ShoppingBag, Clock } from "lucide-react";
import type { CouponInsights, CouponStatusFilter } from "./types";

interface CouponsInsightCardsProps {
  insights: CouponInsights;
  activeStatus: CouponStatusFilter;
  //onSelectFilter: (status: CouponStatusFilter) => void;
}

export function CouponsInsightCards({
  insights,
  activeStatus,
  //onSelectFilter,
}: CouponsInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Coupons",
      count: insights.total.toLocaleString(),
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: "Promotional campaigns",
    },
    {
      id: "active" as const,
      label: "Active Coupons",
      count: insights.activeCount.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Redeemable at checkout",
    },
    {
      id: "uses" as const,
      label: "Total Redemptions",
      count: insights.totalUses.toLocaleString(),
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      activeRing: "",
      subtext: "Orders discounted by coupons",
      isStatOnly: true,
    },
    {
      id: "expired" as const,
      label: "Expired / Inactive",
      count: insights.expiredCount.toLocaleString(),
      icon: Clock,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Past expiration or paused",
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
            onClick={() => {
              if (!card.isStatOnly) {
                //onSelectFilter(card.id as CouponStatusFilter);
              }
            }}
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
