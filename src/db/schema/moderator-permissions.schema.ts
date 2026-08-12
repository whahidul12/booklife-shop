/**
 * ModeratorPermissions — per-user granular permission overrides.
 *
 * One row per moderator. Admins toggle these booleans via the
 * AdminPermissionsPage. All permissions default to false (deny-by-default).
 *
 * Permission columns map exactly to the RBAC statement resources:
 *   books:manage         → canManageBooks
 *   reviews:moderate     → canModerateReviews
 *   authors:manage       → canManageAuthors
 *   publishers:manage    → canManagePublishers
 *   coupons:manage       → canManageCoupons
 *   banners_hero:manage  → canManageHeroBanners
 *   banners_category:manage → canManageCategoryBanners
 */
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

export const moderatorPermissions = pgTable("moderator_permission", {
  /** FK = users.id — one row per moderator */
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  canManageBooks:           boolean("can_manage_books").notNull().default(false),
  canModerateReviews:       boolean("can_moderate_reviews").notNull().default(false),
  canManageAuthors:         boolean("can_manage_authors").notNull().default(false),
  canManagePublishers:      boolean("can_manage_publishers").notNull().default(false),
  canManageCoupons:         boolean("can_manage_coupons").notNull().default(false),
  canManageHeroBanners:     boolean("can_manage_hero_banners").notNull().default(false),
  canManageCategoryBanners: boolean("can_manage_category_banners").notNull().default(false),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
});

export type ModeratorPermission     = typeof moderatorPermissions.$inferSelect;
export type NewModeratorPermission  = typeof moderatorPermissions.$inferInsert;

/** Human-readable label + field key for each permission */
export const PERMISSION_FIELDS = [
  { key: "canManageBooks"          as const, label: "Books — Create / Edit / Delete"          },
  { key: "canModerateReviews"      as const, label: "Reviews — Moderate (hide / unhide)"      },
  { key: "canManageAuthors"        as const, label: "Authors — Create / Edit / Delete"         },
  { key: "canManagePublishers"     as const, label: "Publishers — Create / Edit / Delete"      },
  { key: "canManageCoupons"        as const, label: "Coupons — Create / Update / Delete"       },
  { key: "canManageHeroBanners"    as const, label: "Hero Banners — Upload / Edit / Delete"    },
  { key: "canManageCategoryBanners"as const, label: "Category Banners — Upload / Edit / Delete"},
] satisfies { key: keyof Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">; label: string }[];
