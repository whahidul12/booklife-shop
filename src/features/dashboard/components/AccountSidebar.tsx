"use client";

/**
 * AccountSidebar
 * All nav items render as <Link> except "Logout", which submits a form
 * to the signOutAction Server Action so the session cookie is cleared server-side.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "../constants/constants";
import { signOutAction } from "@/features/auth/actions/auth.actions";

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <nav className="border-border bg-card flex flex-row overflow-x-auto rounded-md border p-2 lg:flex-col lg:overflow-visible">
        {sidebarNavItems.map((item) => {
          // The Logout entry is a form submission, not a navigation link
          if (item.title === "Logout") {
            return (
              <form key="logout" action={signOutAction}>
                <button
                  type="submit"
                  className={cn(
                    "flex w-full min-w-37.5 items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors lg:min-w-0",
                    "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <item.icon className="size-5" />
                  {item.title}
                </button>
              </form>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={`${item.title}-${item.href}`}
              href={item.href}
              className={cn(
                "flex min-w-37.5 items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors lg:min-w-0",
                isActive
                  ? "border border-red-600 bg-red-50 font-medium text-red-600"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
