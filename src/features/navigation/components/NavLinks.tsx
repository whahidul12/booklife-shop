import Link from "next/link";
import { BookDropdown } from "./BookDropdown";
import type { NavLink } from "@/types";

interface NavLinksProps {
  links: NavLink[];
  isBookMenuOpen: boolean;
  onBookMenuEnter: () => void;
  onBookMenuLeave: () => void;
  onBookMenuToggle: () => void;
}

export function NavLinks({
  links,
  isBookMenuOpen,
  onBookMenuEnter,
  onBookMenuLeave,
  onBookMenuToggle,
}: NavLinksProps) {
  return (
    <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
      {links.map((link) =>
        link.children ? (
          <BookDropdown
            key={link.label}
            label={link.label}
            children={link.children}
            isOpen={isBookMenuOpen}
            onMouseEnter={onBookMenuEnter}
            onMouseLeave={onBookMenuLeave}
            onToggle={onBookMenuToggle}
          />
        ) : (
          <Link
            key={link.label}
            href={link.href}
            className="text-foreground hover:text-brand focus-visible:ring-ring rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}
