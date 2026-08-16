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

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://booklife-shop-one.vercel.app";
  }
  return "http://localhost:3000";
};

export const auth = betterAuth({
  // ── Base URL & Security ───────────────────────────────────────────────────
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: async (request) => {
    const origins: string[] = [
      "https://booklife-shop-one.vercel.app",
      "https://*.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:3003",
      "http://localhost:*",
      "http://127.0.0.1:*",
      "http://[::1]:*",
    ];

    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }
    if (process.env.BETTER_AUTH_URL) {
      origins.push(process.env.BETTER_AUTH_URL);
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      origins.push(process.env.NEXT_PUBLIC_APP_URL);
    }
    if (process.env.BETTER_AUTH_TRUSTED_ORIGINS) {
      origins.push(
        ...process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((s) => s.trim())
      );
    }

    if (request) {
      try {
        const origin = request.headers.get("origin");
        if (origin) origins.push(origin);

        const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
        const proto = request.headers.get("x-forwarded-proto") || "https";
        if (host) origins.push(`${proto}://${host}`);
      } catch {
        // Fallback safely if headers cannot be parsed
      }
    }

    return Array.from(new Set(origins.filter(Boolean)));
  },

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
