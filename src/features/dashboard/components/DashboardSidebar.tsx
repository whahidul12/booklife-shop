"use client";

/**
 * DashboardSidebar
 *
 * - Admins see every section including Permissions.
 * - Moderators only see the sections they have been explicitly granted
 *   permission for (permissions prop comes from the RSC layout).
 */
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
  Home,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If set, only visible when this permission is true (or user is admin) */
  permKey?: keyof Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">;
  /** If true, only visible to admins */
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
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
  /** Moderator permissions fetched server-side. null = admin (show all). */
  permissions: ModeratorPermission | null;
}

export function DashboardSidebar({ user, permissions }: DashboardSidebarProps) {
  const pathname = usePathname();
  const role = (user as { role?: string }).role ?? "moderator";
  const isAdmin = role === "admin";

  // Filter nav items based on role + permissions
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (isAdmin) return true;
    if (item.adminOnly) return false;
    if (!item.permKey) return true; // Overview — always visible
    return permissions?.[item.permKey] === true;
  });

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="border-b border-gray-100 px-5 py-4">
        <p className="text-lg font-bold text-red-600">BookLife</p>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          {isAdmin ? "Admin Panel" : "Moderator Panel"}
        </p>
      </div>

      {/* User chip */}
      <div className="border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visibleItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/" || href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-100 px-3 py-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
