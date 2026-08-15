"use client";

/**
 * NavActions — auth-aware nav icons.
 *
 * - When logged in: shows Dashboard button and Sign-Out button
 * - When guest: shows Sign-In button
 * - Always shows: Wishlist, Cart
 */
import { Heart, ShoppingBag, LogOut, LogIn, LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "../store/AppStoreContext";
import { useSession, authClient } from "@/lib/auth-client";

interface NavActionsProps {
  labels?: boolean;
}

export function NavActions({ labels = true }: NavActionsProps) {
  const { cartCount, wishlistCount } = useAppStore();
  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch {
      // ignore
    } finally {
      window.location.href = "/sign-in";
    }
  };

  return (
    <div className={`flex shrink-0 items-center ${labels ? "gap-3 sm:gap-4" : "gap-1"}`}>
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

      {isPending ? (
        <div className="flex min-h-10 min-w-10 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      ) : isLoggedIn ? (
        <>
          {/* Dashboard button */}
          <Link
            href="/dashboard"
            aria-label="Admin Dashboard"
            className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none font-medium"
          >
            <LayoutDashboard className="size-5" aria-hidden="true" />
            {labels && <span className="hidden text-sm lg:inline">ড্যাশবোর্ড</span>}
          </Link>

          {/* Sign-out button */}
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="লগআউট"
            className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none cursor-pointer font-medium"
          >
            <LogOut className="size-5" aria-hidden="true" />
            {labels && <span className="hidden text-sm lg:inline">লগআউট</span>}
          </button>
        </>
      ) : (
        <Link
          href="/sign-in"
          aria-label="লগইন"
          className="text-foreground hover:text-brand focus-visible:ring-ring flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none font-medium"
        >
          <LogIn className="size-5" aria-hidden="true" />
          {labels && <span className="hidden text-sm lg:inline">লগইন</span>}
        </Link>
      )}
    </div>
  );
}
