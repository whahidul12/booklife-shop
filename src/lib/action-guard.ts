/**
 * Server Action guard helpers.
 *
 * Usage in any Server Action:
 *
 *   const session = await requireAuth()
 *   await requirePermission({ books: ["manage"] })
 *
 * Both throw a structured ActionError on failure.
 * Callers should catch and return { error } to the client.
 */
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { statement } from "@/lib/permissions";

// ── Error type ─────────────────────────────────────────────────────────────
export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION"
      | "INTERNAL" = "INTERNAL",
  ) {
    super(message);
    this.name = "ActionError";
  }
}

// ── Shared action result type ──────────────────────────────────────────────
export type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

// ── Auth guard ─────────────────────────────────────────────────────────────

/**
 * Assert the request has a valid session. Returns the session object.
 * Throws ActionError("UNAUTHORIZED") if not authenticated.
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new ActionError("Not authenticated", "UNAUTHORIZED");
  return session;
}

// ── Permission guard ───────────────────────────────────────────────────────

type Resource = keyof typeof statement;
type PermissionMap = Partial<{
  [K in Resource]: (typeof statement)[K][number][];
}>;

/**
 * Assert the current user has the required permission.
 * Admins always pass (BetterAuth admin plugin handles this internally).
 * Throws ActionError("FORBIDDEN") if the permission check fails.
 */
export async function requirePermission(permissions: PermissionMap) {
  const session = await requireAuth();

  const result = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: permissions as Record<string, string[]>,
    },
  });

  // BetterAuth returns { success: boolean }
  if (!result.success) {
    throw new ActionError(
      "You do not have permission to perform this action",
      "FORBIDDEN",
    );
  }

  return session;
}
