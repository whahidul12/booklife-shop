"use server";

/**
 * Moderator Permissions Server Actions
 *
 * getModeratorPermissions(userId)   — returns the permission row (or all-false defaults)
 * setModeratorPermissions(userId, perms) — admin-only upsert
 * getAllModeratorsWithPermissions()  — admin-only: list all moderators with their permissions
 * getMyPermissions()                — returns permissions for the currently logged-in moderator
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { moderatorPermissions, users } from "@/db/schema";
import { requireAuth, requirePermission, ActionError } from "@/lib/action-guard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { ActionResult } from "@/lib/action-guard";
import type { ModeratorPermission } from "@/db/schema";

// All-false default — used when no row exists yet
const DEFAULT_PERMISSIONS: Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy"> = {
  canManageBooks:           false,
  canModerateReviews:       false,
  canManageAuthors:         false,
  canManagePublishers:      false,
  canManageCoupons:         false,
  canManageHeroBanners:     false,
  canManageCategoryBanners: false,
};

// ── Get single moderator's permissions ────────────────────────────────────

export async function getModeratorPermissionsAction(
  targetUserId: string,
): Promise<ActionResult<ModeratorPermission>> {
  try {
    await requireAuth();
    const [row] = await db
      .select()
      .from(moderatorPermissions)
      .where(eq(moderatorPermissions.userId, targetUserId));

    if (row) return { data: row };

    // Return all-false defaults if no row exists yet
    return {
      data: {
        userId:    targetUserId,
        updatedAt: new Date(),
        updatedBy: null,
        ...DEFAULT_PERMISSIONS,
      },
    };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "পারমিশন লোড করা যায়নি" };
  }
}

// ── Get own permissions (for the currently logged-in user) ────────────────

export async function getMyPermissionsAction(): Promise<
  ActionResult<ModeratorPermission>
> {
  try {
    const session = await requireAuth();
    const [row] = await db
      .select()
      .from(moderatorPermissions)
      .where(eq(moderatorPermissions.userId, session.user.id));

    return {
      data: row ?? {
        userId:    session.user.id,
        updatedAt: new Date(),
        updatedBy: null,
        ...DEFAULT_PERMISSIONS,
      },
    };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "পারমিশন লোড করা যায়নি" };
  }
}

// ── Set permissions for a specific moderator (admin-only) ─────────────────

export type PermissionUpdate = Partial<
  Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">
>;

export async function setModeratorPermissionsAction(
  targetUserId: string,
  permissions: PermissionUpdate,
): Promise<ActionResult<void>> {
  try {
    // Only admins can set permissions
    const session = await requireAuth();
    const role = (session.user as { role?: string }).role ?? "customer";
    if (role !== "admin") {
      return { error: "শুধুমাত্র admin এই কাজ করতে পারবেন" };
    }

    const [existing] = await db
      .select({ userId: moderatorPermissions.userId })
      .from(moderatorPermissions)
      .where(eq(moderatorPermissions.userId, targetUserId));

    if (existing) {
      await db
        .update(moderatorPermissions)
        .set({ ...permissions, updatedAt: new Date(), updatedBy: session.user.id })
        .where(eq(moderatorPermissions.userId, targetUserId));
    } else {
      await db.insert(moderatorPermissions).values({
        userId:    targetUserId,
        updatedBy: session.user.id,
        ...DEFAULT_PERMISSIONS,
        ...permissions,
      });
    }

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "পারমিশন সেট করা যায়নি" };
  }
}

// ── List all moderators with their permissions (admin-only) ───────────────

export interface ModeratorWithPermissions {
  id:    string;
  name:  string;
  email: string;
  permissions: ModeratorPermission;
}

export async function getAllModeratorsWithPermissionsAction(): Promise<
  ActionResult<ModeratorWithPermissions[]>
> {
  try {
    const session = await requireAuth();
    const role = (session.user as { role?: string }).role ?? "customer";
    if (role !== "admin") {
      return { error: "শুধুমাত্র admin এই তথ্য দেখতে পারবেন" };
    }

    // Fetch all users whose role is 'moderator'
    const moderatorUsers = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.role, "moderator"));

    // Fetch all existing permission rows in one query
    const permRows = await db.select().from(moderatorPermissions);
    const permMap = new Map(permRows.map((p) => [p.userId, p]));

    const result: ModeratorWithPermissions[] = moderatorUsers.map((u) => ({
      id:    u.id,
      name:  u.name,
      email: u.email,
      permissions: permMap.get(u.id) ?? {
        userId:    u.id,
        updatedAt: new Date(),
        updatedBy: null,
        ...DEFAULT_PERMISSIONS,
      },
    }));

    return { data: result };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "মডারেটর তালিকা লোড করা যায়নি" };
  }
}
