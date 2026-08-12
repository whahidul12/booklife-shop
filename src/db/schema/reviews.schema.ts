
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth.schema";
import { books } from "./books.schema";

export const reviews = pgTable(
  "review",
  {
    id: text("id").primaryKey(),
    // Star rating 1–5 enforced by DB check constraint below
    rating: integer("rating").notNull(),
    // Bangla comment text
    comment: text("comment"),
    // Soft-delete: moderators set this to true to suppress flagged reviews
    isHidden: boolean("is_hidden").notNull().default(false),
    hiddenAt: timestamp("hidden_at"),
    hiddenBy: text("hidden_by").references(() => users.id, {
      onDelete: "set null",
    }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check("rating_range", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ],
);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
