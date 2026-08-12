
import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

export const bannerTypeEnum = pgEnum("banner_type", ["hero", "category"]);

export const banners = pgTable("banner", {
  id: text("id").primaryKey(),
  type: bannerTypeEnum("type").notNull().default("hero"),
  // Bangla title shown in the carousel
  title: text("title"),
  // Cloudinary image URL
  imageUrl: text("image_url").notNull(),
  // Optional small-device image (mobile breakpoint)
  mobileImageUrl: text("mobile_image_url"),
  // Redirect URL when the banner is clicked
  linkUrl: text("link_url"),
  isActive: boolean("is_active").notNull().default(true),
  // Lower number = shown first
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;
