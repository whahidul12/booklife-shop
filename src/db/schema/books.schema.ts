
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { authors } from "./taxonomy.schema";
import { publishers } from "./taxonomy.schema";
import { subjects } from "./taxonomy.schema";
import { users } from "./auth.schema";

// Book format enum — values stored in Bangla-compatible text but constrained
export const bookFormatEnum = pgEnum("book_format", [
  "hardcover",
  "paperback",
  "ebook",
]);

// Books ====================>>>>>>>>>>>>>>>>>>>>=============
export const books = pgTable("book", {
  id: text("id").primaryKey(),
  // Bangla title
  name: text("name").notNull(),
  // Bangla display edition (e.g. "৩য় সংস্করণ")
  edition: text("edition"),
  // Bangla or English language descriptor
  language: text("language"),
  format: bookFormatEnum("format").default("paperback"),
  // Total page count — stored as integer, displayed in Bangla numerals on the UI
  totalPages: integer("total_pages"),
  // Price in BDT (stored as integer paisa to avoid floating-point issues)
  pricePaisa: integer("price_paisa").notNull(),
  // Discounted price in paisa (null = no discount)
  discountPricePaisa: integer("discount_price_paisa"),
  stock: integer("stock").notNull().default(0),
  // Cloudinary image URL
  imageUrl: text("image_url"),
  // Short Bangla description
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPreorder: boolean("is_preorder").notNull().default(false),
  authorId: text("author_id").references(() => authors.id, {
    onDelete: "set null",
  }),
  publisherId: text("publisher_id").references(() => publishers.id, {
    onDelete: "set null",
  }),
  subjectId: text("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
