import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

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
      </div>
    </div>
  );
}
