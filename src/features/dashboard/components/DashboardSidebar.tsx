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
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-gray-200/80 bg-white">
      {/* Brand Header */}
      <div className="border-b border-gray-100 px-5 py-4.5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-[#D10A13]">
            BookLife
          </span>
          <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D10A13] border border-red-100">
            {isAdmin ? "Admin" : "Mod"}
          </span>
        </div>
        <p className="text-[11px] font-medium text-gray-400 mt-0.5">
          Management Portal
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-1">
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
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-red-50 text-[#D10A13] shadow-2xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive ? "text-[#D10A13]" : "text-gray-400 group-hover:text-gray-600"
                    )}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Footer: User Info & Sign Out */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-3 space-y-2">
        {/* Sign out */}
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 transition-all hover:bg-red-50 hover:text-[#D10A13] active:scale-[0.98] group cursor-pointer"
          >
            <LogOut
              className="size-4 shrink-0 text-gray-400 group-hover:text-[#D10A13] transition-colors"
              aria-hidden="true"
            />
            <span>Sign out</span>
          </button>
        </form>

        {/* User Card */}
        <div className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-2xs border border-gray-200/70">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 font-bold text-xs text-[#D10A13] border border-red-100 shadow-2xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-gray-900 leading-tight">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-gray-400 font-mono leading-tight mt-0.5">
              {user.email}
            </p>
          </div>
        </div>


      </div>
    </aside>
  );
}
