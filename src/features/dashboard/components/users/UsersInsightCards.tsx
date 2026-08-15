"use client";

import React from "react";
import { Users, ShieldAlert, ShieldCheck, UserCheck, Ban } from "lucide-react";
import type { UserInsights, UserRoleFilter } from "./types";

interface UsersInsightCardsProps {
  insights: UserInsights;
  activeRole: UserRoleFilter;
  onSelectRole: (role: UserRoleFilter) => void;
}

export function UsersInsightCards({
  insights,
  activeRole,
  onSelectRole,
}: UsersInsightCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Users",
      count: insights.total.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      activeRing: "ring-2 ring-blue-500",
      subtext: `${insights.banned} banned accounts`,
    },
    {
      id: "customer" as const,
      label: "Registered Customers",
      count: insights.customers.toLocaleString(),
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      activeRing: "ring-2 ring-emerald-500",
      subtext: "Shoppers & book buyers",
    },
    {
      id: "moderator" as const,
      label: "Staff Moderators",
      count: insights.moderators.toLocaleString(),
      icon: ShieldCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      activeRing: "ring-2 ring-purple-500",
      subtext: "Scoped staff access",
    },
    {
      id: "admin" as const,
      label: "Administrators",
      count: insights.admins.toLocaleString(),
      icon: ShieldAlert,
      color: "text-[#D10A13]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      activeRing: "ring-2 ring-[#D10A13]",
      subtext: "Full platform control",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeRole === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectRole(card.id)}
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
