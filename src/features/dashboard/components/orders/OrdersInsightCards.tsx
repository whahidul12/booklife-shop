"use client";

import React from "react";
import { ShoppingBag, Clock, Truck, CheckCircle2, DollarSign } from "lucide-react";
import type { OrderInsights, OrderStatusFilter } from "./types";

interface OrdersInsightCardsProps {
  insights: OrderInsights;
  activeStatus: OrderStatusFilter;
  //onSelectStatus: (status: OrderStatusFilter) => void;
}

export function OrdersInsightCards({
  insights,
  activeStatus,
  //onSelectStatus,
}: OrdersInsightCardsProps) {
  const totalRevenueTaka = (insights.totalRevenuePaisa / 100).toLocaleString();

  const cards = [
    {
      id: "all" as const,
      label: "Total Orders",
      count: insights.total.toLocaleString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: `৳ ${totalRevenueTaka} gross sales`,
    },
    {
      id: "pending" as const,
      label: "Pending Processing",
      count: insights.pendingCount.toLocaleString(),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      activeRing: "ring-2 ring-amber-500",
      subtext: "Needs staff confirmation",
    },
    {
      id: "shipped" as const,
      label: "Shipped / In Transit",
      count: insights.shippedCount.toLocaleString(),
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      activeRing: "ring-2 ring-purple-500",
      subtext: "Dispatched via courier",
    },
    {
      id: "delivered" as const,
      label: "Delivered & Completed",
      count: insights.deliveredCount.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Successfully completed",
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
            //onClick={() => onSelectStatus(card.id)}
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
