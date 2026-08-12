import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moderatorPermissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import type { ModeratorPermission } from "@/db/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in?callbackUrl=/dashboard");

  const role = (session.user as { role?: string }).role ?? "customer";
  if (role !== "admin" && role !== "moderator") redirect("/");

  // Admins get null — sidebar shows all items
  let perms: ModeratorPermission | null = null;

  if (role === "moderator") {
    const [row] = await db
      .select()
      .from(moderatorPermissions)
      .where(eq(moderatorPermissions.userId, session.user.id));

    // If no row exists yet (new moderator), use all-false defaults
    perms = row ?? {
      userId: session.user.id,
      canManageBooks: false,
      canModerateReviews: false,
      canManageAuthors: false,
      canManagePublishers: false,
      canManageCoupons: false,
      canManageHeroBanners: false,
      canManageCategoryBanners: false,
      updatedAt: new Date(),
      updatedBy: null,
    };
  }

  return (
    <DashboardShell user={session.user} permissions={perms}>
      {children}
    </DashboardShell>
  );
}
