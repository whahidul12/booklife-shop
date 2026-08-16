"use client";

/**
 * DashboardShell — the persistent admin/moderator layout wrapper.
 * Receives the authed user + their permission row from the RSC layout.
 */
import React from "react";
import { cn } from "@/lib/utils";
import type { ModeratorPermission } from "@/db/schema";
import {
  DashboardProvider,
  useDashboard,
  DashboardHeader,
  DashboardSidebar,
} from "./layout";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name: string; email: string; role?: string; image?: string | null } & Record<string, unknown>;
  permissions: ModeratorPermission | null;
}

function DashboardInnerShell({
  children,
  user,
  permissions,
}: DashboardShellProps) {
  const { isCollapsed } = useDashboard();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex">
      {/* ── Left Sidebar (Collapsible / Mobile Responsive) ───────────── */}
      <DashboardSidebar user={user} permissions={permissions} />

      {/* ── Main Content Container (Smooth offset) ──────────────────── */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out",
          // Adapt margin offset on desktop (>= lg) according to collapsed state
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* ── Global Top Header Bar (Search, Alerts, User Chip) ──────── */}
        <DashboardHeader user={user} />

        {/* ── Page Body ──────────────────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <DashboardProvider>
      <DashboardInnerShell {...props} />
    </DashboardProvider>
  );
}
