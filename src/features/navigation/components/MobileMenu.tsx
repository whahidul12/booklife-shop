"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";
import { useSession, authClient } from "@/lib/auth-client";

interface MobileMenuProps {
  links: NavLink[];
  isBookMenuOpen: boolean;
  onBookMenuToggle: () => void;
}

export function MobileMenu({
  links,
  isBookMenuOpen,
  onBookMenuToggle,
}: MobileMenuProps) {
  const { data: session } = useSession();
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
    <div
      id="mobile-navigation"
      className="border-border bg-card border-t px-4 py-3 lg:hidden"
    >
      <div className="mx-auto flex max-w-350 flex-col gap-1">
        {links.map((link) =>
          link.children ? (
            <div key={link.label}>
              <button
                type="button"
                className="text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium"
                aria-expanded={isBookMenuOpen}
                onClick={onBookMenuToggle}
              >
                {link.label}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    isBookMenuOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
              {isBookMenuOpen && (
                <div className="flex flex-col gap-1 pl-4">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 items-center rounded-md px-3 text-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 items-center rounded-md px-3 text-sm font-medium"
            >
              {link.label}
            </Link>
          ),
        )}

        {/* Auth Links on Mobile Drawer */}
        <div className="border-border mt-2 border-t pt-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium"
              >
                <LayoutDashboard className="size-4 text-[#D10A11]" />
                <span>ড্যাশবোর্ড</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-50 flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-sm font-medium cursor-pointer text-left"
              >
                <LogOut className="size-4" />
                <span>লগআউট</span>
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium"
            >
              <LogIn className="size-4" />
              <span>লগইন করুন</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
