"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/features/auth/actions/auth.actions";
import type { ModeratorPermission } from "@/db/schema";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  Tag,
  Star,
  Ticket,
  Image,
  ShoppingBag,
  UserCog,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permKey?: keyof Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Books", href: "/dashboard/books", icon: BookOpen, permKey: "canManageBooks" },
  { label: "Authors", href: "/dashboard/authors", icon: Users, permKey: "canManageAuthors" },
  { label: "Publishers", href: "/dashboard/publishers", icon: Building2, permKey: "canManagePublishers" },
  { label: "Subjects", href: "/dashboard/subjects", icon: Tag, permKey: "canManageBooks" },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star, permKey: "canModerateReviews" },
  { label: "Coupons", href: "/dashboard/coupons", icon: Ticket, permKey: "canManageCoupons" },
  { label: "Banners", href: "/dashboard/banners", icon: Image, permKey: "canManageHeroBanners" },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag, permKey: "canManageBooks" },
  { label: "Users", href: "/dashboard/users", icon: UserCog, adminOnly: true },
  { label: "Permissions", href: "/dashboard/permissions", icon: ShieldCheck, adminOnly: true },
];

interface DashboardSidebarProps {
  user: { name: string; email: string; role?: string } & Record<string, unknown>;
  permissions: ModeratorPermission | null;
}

export function DashboardSidebar({ user, permissions }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, closeMobile } = useDashboard();

  const role = (user as { role?: string }).role ?? "moderator";
  const isAdmin = role === "admin";

  // Filter items based on permissions
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (isAdmin) return true;
    if (item.adminOnly) return false;
    if (!item.permKey) return true;
    return permissions?.[item.permKey] === true;
  });

  return (
    <>
      {/* ── Mobile Backdrop Overlay (< lg) ───────────────────────────────── */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Container ────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200/80 bg-white shadow-xl transition-all duration-300 ease-in-out lg:shadow-none",
          // Desktop positioning & width
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile visibility & sliding drawer (always w-72 on mobile for full readability)
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Brand Header ───────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-gray-100 px-4 transition-all",
            isCollapsed ? "lg:justify-center justify-between px-5" : "justify-between px-5"
          )}
        >
          <Link
            href="/dashboard"
            onClick={closeMobile}
            className="flex items-center gap-2 group overflow-hidden"
          >
            {/* Compact Desktop Logo (only shown on desktop when collapsed) */}
            {isCollapsed && (
              <div className="hidden lg:flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D10A13] to-red-600 text-white font-black text-sm shadow-sm shadow-red-500/30">
                BL
              </div>
            )}

            {/* Full Brand Logo (always visible on mobile, and visible on desktop when expanded) */}
            <div className={cn("flex items-center gap-2", isCollapsed && "lg:hidden")}>
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#D10A13] text-white font-black text-xs shadow-sm">
                BL
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-gray-900 group-hover:text-[#D10A13] transition-colors">
                    Book<span className="text-[#D10A13]">Life</span>
                  </span>
                  <span className="rounded-md bg-red-50 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-[#D10A13] border border-red-100">
                    {isAdmin ? "Admin" : "Mod"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  Management Portal
                </p>
              </div>
            </div>
          </Link>

          {/* Close button on mobile drawer */}
          <button
            type="button"
            onClick={closeMobile}
            className="flex lg:hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Nav Links Area ─────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
          <ul className="space-y-1">
            {visibleItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === href
                  : pathname.startsWith(href);

              return (
                <li key={href} className="relative group">
                  <Link
                    href={href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98]",
                      // Desktop collapsed vs Mobile/Expanded layout
                      isCollapsed
                        ? "lg:justify-center lg:p-3 gap-3 px-3.5 py-2.5"
                        : "gap-3 px-3.5 py-2.5",
                      isActive
                        ? "bg-red-50 text-[#D10A13] shadow-2xs font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isCollapsed ? "lg:size-5 size-4.5" : "size-4.5",
                        isActive
                          ? "text-[#D10A13]"
                          : "text-gray-400 group-hover:text-gray-700"
                      )}
                      aria-hidden="true"
                    />

                    {/* Text Label: Hidden on desktop if collapsed, ALWAYS visible on mobile */}
                    <span
                      className={cn(
                        "truncate flex-1",
                        isCollapsed && "lg:hidden"
                      )}
                    >
                      {label}
                    </span>

                    {/* Active Dot Indicator */}
                    {isActive && (
                      <span
                        className={cn(
                          "size-1.5 rounded-full bg-[#D10A13]",
                          isCollapsed && "lg:hidden"
                        )}
                      />
                    )}
                  </Link>

                  {/* Tooltip Popover (only on desktop when collapsed) */}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden lg:flex items-center z-50 opacity-0 group-hover:opacity-100 transition-all duration-150">
                      <div className="rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg whitespace-nowrap">
                        {label}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom Footer Area ─────────────────────────────────────────── */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-2.5 space-y-2">
          {/* Sign Out Button */}
          <form action={signOutAction}>
            <button
              type="submit"
              className={cn(
                "flex w-full items-center rounded-xl text-xs font-semibold text-gray-600 transition-all hover:bg-red-50 hover:text-[#D10A13] active:scale-[0.98] group cursor-pointer",
                isCollapsed
                  ? "lg:justify-center lg:p-2.5 gap-2.5 px-3 py-2"
                  : "gap-2.5 px-3 py-2"
              )}
              title={isCollapsed ? "Sign out" : undefined}
            >
              <LogOut
                className="size-4 shrink-0 text-gray-400 group-hover:text-[#D10A13] transition-colors"
                aria-hidden="true"
              />
              <span className={cn(isCollapsed && "lg:hidden")}>Sign out</span>
            </button>
          </form>

          {/* User Mini Card (Always visible on mobile, hidden on desktop only when collapsed) */}
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-2xs border border-gray-200/70",
              isCollapsed && "lg:hidden"
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 font-bold text-xs text-[#D10A13] border border-red-100 shadow-2xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900 leading-tight">
                {user.name || "User"}
              </p>
              <p className="truncate text-[10px] text-gray-400 font-mono leading-tight mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
