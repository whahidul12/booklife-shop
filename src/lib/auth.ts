/**
 * BetterAuth server instance.
 *
 * Configured with:
 *  - Email / password authentication
 *  - Drizzle ORM adapter (Neon Postgres)
 *  - Admin plugin with granular RBAC (custom access control)
 *  - nextCookies plugin — auto-sets cookies in Server Actions
 *
 * Usage in Server Actions / RSCs:
 *   import { auth } from "@/lib/auth"
 *   import { headers } from "next/headers"
 *   const session = await auth.api.getSession({ headers: await headers() })
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import {
  ac,
  adminRole,
  moderatorRole,
  customerRole,
  booksModeratorRole,
  authorsModeratorRole,
  publishersModeratorRole,
  subjectsModeratorRole,
  reviewsModeratorRole,
  couponsModeratorRole,
  marketingModeratorRole,
  ordersModeratorRole,
} from "@/lib/permissions";

export const auth = betterAuth({
  // ── Base URL ─────────────────────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Database ─────────────────────────────────────────────────────────────
  database: drizzleAdapter(db, {
    provider: "pg",
    // Map BetterAuth table names to our Drizzle schema objects
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // ── Email / Password ─────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    // Require minimum 8-char passwords
    minPasswordLength: 8,
  },

  // ── User ─────────────────────────────────────────────────────────────────
  user: {
    // Store additional fields on the user record
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false, // not settable by the user directly
      },
    },
  },

  // ── Plugins ──────────────────────────────────────────────────────────────
  plugins: [
    adminPlugin({
      // Custom access control — ties our RBAC roles to BetterAuth
      ac,
      roles: {
        customer: customerRole,
        moderator: moderatorRole,
        admin: adminRole,
        // Granular sub-roles (comma-combined in user.role field)
        books_mod: booksModeratorRole,
        authors_mod: authorsModeratorRole,
        publishers_mod: publishersModeratorRole,
        subjects_mod: subjectsModeratorRole,
        reviews_mod: reviewsModeratorRole,
        coupons_mod: couponsModeratorRole,
        marketing_mod: marketingModeratorRole,
        orders_mod: ordersModeratorRole,
      },
      // Users with "admin" role are superusers
      adminRoles: ["admin"],
      // Default role assigned on registration
      defaultRole: "customer",
    }),
    // Must be last — automatically handles Set-Cookie in Server Actions
    nextCookies(),
  ],
});

// ── Inferred types ────────────────────────────────────────────────────────
export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
