
import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

// ── Authors ────────────────────────────────────────────────────────────────
export const authors = pgTable("author", {
  id: text("id").primaryKey(),
  // Bangla name (UTF-8 text)
  name: text("name").notNull(),
  // Short biography (Bangla supported)
  bio: text("bio"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

// ── Publishers ─────────────────────────────────────────────────────────────
export const publishers = pgTable("publisher", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

// ── Subjects (categories) ──────────────────────────────────────────────────
export const subjects = pgTable("subject", {
  id: text("id").primaryKey(),
  // Display title in Bangla
  title: text("title").notNull(),
  // URL-safe slug (e.g. "islamic-books") — used for routing
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: text("sort_order").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Publisher = typeof publishers.$inferSelect;
export type NewPublisher = typeof publishers.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
