/**
 * DashboardShell — the persistent admin/moderator layout wrapper.
 * Receives the authed user + their permission row from the RSC layout.
 */
import { DashboardSidebar } from "./DashboardSidebar";
import type { ModeratorPermission } from "@/db/schema";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name: string; email: string; role?: string } & Record<string, unknown>;
  /** null = admin (show all nav items). Moderators get their permission row. */
  permissions: ModeratorPermission | null;
}

export function DashboardShell({ children, user, permissions }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-[1400px] gap-0">
        <DashboardSidebar user={user} permissions={permissions} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
