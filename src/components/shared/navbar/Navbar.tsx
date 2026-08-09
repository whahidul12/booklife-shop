"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNavbarVisibility,
  MobileMenu,
  NavActions,
  SearchBar,
  Logo,
  NavLinks,
  navLinks,
} from "@/features/navigation";

export function Navbar() {
  const { topHeaderRef, isTopHeaderVisible } = useNavbarVisibility();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookMenuOpen, setIsBookMenuOpen] = useState(false);

  return (
    <>
      <header
        ref={topHeaderRef}
        className="border-border bg-card w-full border-b"
      >
        <div className="mx-auto flex max-w-350 flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:py-4 md:px-6 lg:flex-nowrap lg:gap-8">
          <button
            type="button"
            className="text-foreground hover:text-brand focus-visible:ring-ring flex size-10 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none lg:hidden"
            aria-label={isMobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>

          <Logo />
          <SearchBar />

          <div className="ml-auto">
            <NavActions />
          </div>
        </div>
      </header>

      <nav
        className="border-border bg-card sticky top-0 z-50 border-b shadow-sm"
        aria-label="প্রধান নেভিগেশন"
      >
        <div className="mx-auto hidden min-h-16 max-w-350 items-center gap-2 px-4 md:px-6 lg:flex">
          {/* Compact logo — slides in when top header scrolls out of view */}
          <div
            className={cn(
              "flex shrink-0 items-center overflow-hidden transition-[max-width,opacity] duration-300",
              isTopHeaderVisible
                ? "pointer-events-none max-w-0 opacity-0"
                : "max-w-36 opacity-100",
            )}
            aria-hidden={isTopHeaderVisible}
          >
            <Logo compact />
          </div>

          <NavLinks
            links={navLinks}
            isBookMenuOpen={isBookMenuOpen}
            onBookMenuEnter={() => setIsBookMenuOpen(true)}
            onBookMenuLeave={() => setIsBookMenuOpen(false)}
            onBookMenuToggle={() => setIsBookMenuOpen((open) => !open)}
          />

          {/* Compact actions — slides in when top header scrolls out of view */}
          <div
            className={cn(
              "ml-auto flex shrink-0 items-center overflow-hidden py-1 transition-[max-width,opacity] duration-300",
              isTopHeaderVisible
                ? "pointer-events-none max-w-0 opacity-0"
                : "max-w-40 opacity-100",
            )}
            aria-hidden={isTopHeaderVisible}
          >
            <NavActions labels={false} />
          </div>
        </div>

        {isMobileMenuOpen && (
          <MobileMenu
            links={navLinks}
            isBookMenuOpen={isBookMenuOpen}
            onBookMenuToggle={() => setIsBookMenuOpen((open) => !open)}
          />
        )}
      </nav>
    </>
  );
}
