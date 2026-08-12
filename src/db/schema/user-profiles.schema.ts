
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

export const userProfiles = pgTable("user_profile", {
  /** FK = users.id  (1-to-1) */
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone"),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
