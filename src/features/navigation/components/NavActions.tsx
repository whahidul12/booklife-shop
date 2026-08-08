"use client";

/**
 * NavActions — auth-aware nav icons.
 *
 * - Admin/Moderator: shows a "Dashboard" button that takes them directly to /dashboard
 * - Customer: shows account link → /account
 * - All logged-in: wishlist, cart, sign-out
 * - Guest: sign-in link
 */
import { Heart, ShoppingBag, User, LogOut, LogIn, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "../store/AppStoreContext";
import { useSession } from "@/lib/auth-client";
import { signOutAction } from "@/features/auth/actions/auth.actions";

interface NavActionsProps {
  labels?: boolean;
}

export function NavActions({ labels = true }: NavActionsProps) {
  const { cartCount, wishlistCount } = useAppStore();
  const { data: session, isPending } = useSession();
  const isLoggedIn = !isPending && !!session?.user;
  const role = (session?.user as { role?: string } | undefined)?.role ?? "customer";
  const isStaff = role === "admin" || role === "moderator";

  return (
    <div className={`flex shrink-0 items-center ${labels ? "gap-4" : "gap-0"}`}>
      {/* Wishlist */}
      <Link
        href="/account/wishlist"
        aria-label="উইশলিস্ট"
        className="text-foreground hover:text-brand focus-visible:ring-ring relative flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Heart className="size-5" aria-hidden="true" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
        )}
        {labels && <span className="hidden text-sm lg:inline">উইশলিস্ট</span>}
      </Link>

      {/* Cart */}
      <Link
        href="/cart"
        aria-label="শপিং ব্যাগ"
        className="text-foreground hover:text-brand focus-visible:ring-ring relative flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
        {labels && <span className="hidden text-sm lg:inline">শপিং ব্যাগ</span>}
      </Link>

      {isLoggedIn ? (
        <>
          {/* Admin/Moderator → Dashboard button (prominent) */}
          {isStaff ? (
            <Link
              href="/dashboard"
              aria-label="Admin Dashboard"
              className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <LayoutDashboard className="size-5" aria-hidden="true" />
              {labels && <span className="hidden text-sm lg:inline">ড্যাশবোর্ড</span>}
            </Link>
          ) : (
            /* Regular customer → Account link */
            <Link
              href="/account"
              aria-label="অ্যাকাউন্ট"
              className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <User className="size-5" aria-hidden="true" />
              {labels &&
                <span className="hidden text-sm lg:inline">অ্যাকাউন্ট</span>
              }
            </Link>
          )}

          {/* Sign-out */}
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="লগআউট"
              className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <LogOut className="size-5" aria-hidden="true" />
              {labels && (
                <span className="hidden text-sm lg:inline">লগআউট</span>
              )}
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/sign-in"
          aria-label="লগইন"
          className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <LogIn className="size-5" aria-hidden="true" />
          {labels && <span className="hidden text-sm lg:inline">লগইন</span>}
        </Link>
      )}
    </div>
  );
}
