"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Mail,
  Bell,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
  Shield,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  Ticket,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";
import { signOutAction } from "@/features/auth/actions/auth.actions";

interface DashboardHeaderProps {
  user: { name: string; email: string; role?: string; image?: string | null } & Record<string, unknown>;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { isCollapsed, toggleCollapse, toggleMobile } = useDashboard();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notification dropdown state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Messages dropdown state
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Theme mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(false);

  const role = (user as { role?: string }).role ?? "moderator";
  const isAdmin = role === "admin";

  // Quick navigation items for search
  const quickSearchItems = [
    { title: "Dashboard Overview", category: "Navigation", href: "/dashboard", icon: Sparkles },
    { title: "Books Catalog", category: "Navigation", href: "/dashboard/books", icon: BookOpen },
    { title: "Orders Management", category: "Navigation", href: "/dashboard/orders", icon: ShoppingBag },
    { title: "Authors List", category: "Navigation", href: "/dashboard/authors", icon: Users },
    { title: "Discount Coupons", category: "Navigation", href: "/dashboard/coupons", icon: Ticket },
    { title: "User Accounts", category: "Navigation", href: "/dashboard/users", icon: User },
    { title: "Staff Permissions", category: "Navigation", href: "/dashboard/permissions", icon: Shield },
  ];

  const filteredSearchItems = quickSearchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) {
        setIsMessagesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md transition-all">
      {/* ── Left Area: Sidebar Toggles & Search Bar ─────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile Hamburger Drawer Toggle (< lg) */}
        <button
          type="button"
          onClick={toggleMobile}
          className="flex lg:hidden size-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Desktop Collapse / Expand Toggle (>= lg) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex size-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeft className="size-5 text-gray-600" />
          ) : (
            <PanelLeftClose className="size-5 text-gray-500" />
          )}
        </button>

        {/* Pill-Shaped Search Input with Button (Matching Photo) */}
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search..."
              className="w-full rounded-full border border-gray-200/90 bg-gray-50/70 py-2 pl-4 pr-11 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 shadow-2xs transition-all focus:border-[#D10A13] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D10A13]/15"
            />
            {/* Pill Search Icon Button (accent purple/red) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-1 flex size-7 sm:size-8 items-center justify-center rounded-full bg-brand hover:bg-[#6D28D9] text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
              aria-label="Search"
            >
              <Search className="size-3.5 sm:size-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Search Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 top-full mt-2 w-full min-w-[280px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Quick Navigation & Jump
              </div>
              <div className="space-y-0.5 max-h-60 overflow-y-auto">
                {filteredSearchItems.length === 0 ? (
                  <p className="px-3 py-4 text-center text-xs text-gray-400">
                    No matching results for "{searchQuery}"
                  </p>
                ) : (
                  filteredSearchItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(item.href);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#D10A13] transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 text-gray-400 group-hover:text-[#D10A13] transition-colors" />
                          <span>{item.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{item.category}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Area: Action Icons & User Dropdown Chip ────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex size-9 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Moon className="size-4 text-purple-600" />
          ) : (
            <Sun className="size-4 text-amber-500" />
          )}
        </button>

        {/* Mail / Messages Button with Notification Badge */}
        <div className="relative" ref={messagesRef}>
          <button
            type="button"
            onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            className="relative flex size-9 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Messages"
          >
            <Mail className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#D10A13] text-[9px] font-bold text-white ring-2 ring-white">
              2
            </span>
          </button>

          {/* Messages Dropdown */}
          {isMessagesOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">Customer Messages</span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#D10A13]">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-gray-100 py-1 text-xs">
                <div className="py-2 hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors">
                  <p className="font-semibold text-gray-900">Karim Rahman</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    "When will the restock of General Science arrive?"
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">10 mins ago</span>
                </div>
                <div className="py-2 hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors">
                  <p className="font-semibold text-gray-900">Fatima Begum</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    "Inquiry regarding bKash payment verification for #ORD-84"
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell Button */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex size-9 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-[#D10A13] ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">Recent Store Alerts</span>
                <span className="text-[11px] text-gray-400">All caught up</span>
              </div>
              <div className="divide-y divide-gray-100 py-1 text-xs">
                <div className="py-2.5 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-start gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">New Order Placed</p>
                    <p className="text-[11px] text-gray-500">Order #ORD-129 for ৳ 1,450 received.</p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">5 mins ago</span>
                  </div>
                </div>
                <div className="py-2.5 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-start gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Inventory Alert</p>
                    <p className="text-[11px] text-gray-500">Low stock on 2 Academic books.</p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">35 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── User Profile Dropdown Chip (Matching Exact Photo) ─────────── */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 rounded-full border border-gray-200/80 bg-white py-1 pl-1 pr-3 shadow-2xs hover:bg-gray-50/80 transition-all active:scale-98 cursor-pointer"
          >
            {/* Illustrated / Initial Avatar Circle */}
            <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-white font-bold text-xs shadow-2xs border border-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </div>

            {/* Name and Role text */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {user.name || "Administrator"}
              </p>
              <p className="text-[10px] font-medium text-gray-500 leading-tight capitalize">
                {role}
              </p>
            </div>

            {/* Chevron Icon */}
            <ChevronDown className="size-3.5 text-gray-400 transition-transform duration-200" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* User Bio Header */}
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate font-mono mt-0.5">
                  {user.email}
                </p>
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase text-[#D10A13] mt-1.5 border border-red-100">
                  {role}
                </span>
              </div>

              {/* Action Links */}
              <div className="py-1 space-y-0.5">
                <Link
                  href="/"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink className="size-3.5 text-gray-400" />
                  <span>View Storefront</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <User className="size-3.5 text-gray-400" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 my-1" />

              {/* Sign Out Action */}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#D10A13] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
