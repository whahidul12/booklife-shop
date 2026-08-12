/**
 * RBAC — Access Control Statements and Role Definitions
 *
 * Uses BetterAuth's admin plugin access control system.
 * Import `ac` and role objects wherever permission checks are needed.
 *
 * Resources and their permitted actions:
 *  - books        → manage (create, update, delete)
 *  - authors      → manage
 *  - publishers   → manage
 *  - subjects     → manage
 *  - reviews      → moderate (hide/unhide)
 *  - coupons      → manage (create, delete, set limits/expiry)
 *  - marketing    → manage (hero/category banners)
 *  - orders       → view, update-status, cancel
 *
 * Roles:
 *  - customer   → no staff permissions (default on registration)
 *  - moderator  → granular subset assigned by admin
 *  - admin      → full access to every resource + user management
 */
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// ── Permission statements ──────────────────────────────────────────────────
export const statement = {
  ...defaultStatements,
  books: ["manage"] as const,
  authors: ["manage"] as const,
  publishers: ["manage"] as const,
  subjects: ["manage"] as const,
  reviews: ["moderate"] as const,
  coupons: ["manage"] as const,
  marketing: ["manage"] as const,
  orders: ["view", "update-status", "cancel"] as const,
} as const;

export const ac = createAccessControl(statement);

// ── Customer ───────────────────────────────────────────────────────────────
// Default role — no staff-level permissions.
export const customerRole = ac.newRole({});

// ── Moderator ──────────────────────────────────────────────────────────────
// A moderator starts with NO permissions; the admin grants individual ones
// by setting the user's role to one of the granular strings below.
// We define a "full moderator" role here for convenience — in practice the
// admin can assign any combination by storing a comma-separated role string.
export const moderatorRole = ac.newRole({
  books: ["manage"],
  authors: ["manage"],
  publishers: ["manage"],
  subjects: ["manage"],
  reviews: ["moderate"],
  coupons: ["manage"],
  marketing: ["manage"],
  orders: ["view", "update-status", "cancel"],
});

// Granular sub-roles (can be comma-combined in the user.role column)
export const booksModeratorRole = ac.newRole({ books: ["manage"] });
export const authorsModeratorRole = ac.newRole({ authors: ["manage"] });
export const publishersModeratorRole = ac.newRole({ publishers: ["manage"] });
export const subjectsModeratorRole = ac.newRole({ subjects: ["manage"] });
export const reviewsModeratorRole = ac.newRole({ reviews: ["moderate"] });
export const couponsModeratorRole = ac.newRole({ coupons: ["manage"] });
export const marketingModeratorRole = ac.newRole({ marketing: ["manage"] });
export const ordersModeratorRole = ac.newRole({
  orders: ["view", "update-status", "cancel"],
});

// ── Admin ──────────────────────────────────────────────────────────────────
// Full access: all custom resources + all BetterAuth admin built-ins.
export const adminRole = ac.newRole({
  ...adminAc.statements,
  books: ["manage"],
  authors: ["manage"],
  publishers: ["manage"],
  subjects: ["manage"],
  reviews: ["moderate"],
  coupons: ["manage"],
  marketing: ["manage"],
  orders: ["view", "update-status", "cancel"],
});
