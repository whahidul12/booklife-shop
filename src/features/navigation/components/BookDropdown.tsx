import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavChildLink } from "@/types";

interface BookDropdownProps {
  label: string;
  children: NavChildLink[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}

export function BookDropdown({
  label,
  children,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onToggle,
}: BookDropdownProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        className="text-foreground hover:text-brand focus-visible:ring-ring flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="border-border bg-popover text-popover-foreground absolute top-full left-0 min-w-52 rounded-md border p-1 shadow-md"
        >
          {children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              role="menuitem"
              className="hover:bg-accent hover:text-brand focus-visible:ring-ring block rounded-sm px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
