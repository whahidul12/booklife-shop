/**
 * Orders, order items, addresses, wishlist, and coupons schema.
 */
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  check,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth.schema";
import { books } from "./books.schema";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

// Coupons
export const coupons = pgTable(
  "coupon",
  {
    id: text("id").primaryKey(),
    // Coupon code (case-insensitive match enforced in application layer)
    code: text("code").notNull().unique(),
    // Discount amount in paisa
    discountPaisa: integer("discount_paisa").notNull(),
    // Maximum number of times this coupon can be used (null = unlimited)
    maxUses: integer("max_uses"),
    // How many times it has been used so far
    usedCount: integer("used_count").notNull().default(0),
    // Optional expiry date
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    check(
      "discount_positive",
      sql`${table.discountPaisa} > 0`,
    ),
  ],
);

// Addresses
export const addresses = pgTable("address", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Address label, e.g. "বাড়ি" / "অফিস"
  label: text("label"),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  district: text("district"),
  // Whether this is the user's default shipping address
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Orders
export const orders = pgTable("order", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  // Payment method label, e.g. "cash_on_delivery" | "bkash" | "card"
  paymentMethod: text("payment_method").notNull().default("cash_on_delivery"),
  // Snapshot of delivery address at order time (denormalised for immutability)
  shippingAddressSnapshot: text("shipping_address_snapshot").notNull(),
  // Optional delivery note from the customer
  deliveryNote: text("delivery_note"),
  // All amounts in paisa
  subtotalPaisa: integer("subtotal_paisa").notNull(),
  deliveryFeePaisa: integer("delivery_fee_paisa").notNull().default(6500),
  couponDiscountPaisa: integer("coupon_discount_paisa").notNull().default(0),
  totalPaisa: integer("total_paisa").notNull(),
  couponId: text("coupon_id").references(() => coupons.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_item", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
  // Snapshot of price at the time of purchase (immutable)
  unitPricePaisa: integer("unit_price_paisa").notNull(),
  discountPricePaisa: integer("discount_price_paisa"),
  // Snapshot of book title (in case book is later renamed)
  bookNameSnapshot: text("book_name_snapshot").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Wishlist
export const wishlists = pgTable("wishlist", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Cart Items
export const cartItems = pgTable(
  "cart_item",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("cart_user_book_unique").on(table.userId, table.bookId),
  ],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type CartItemRow = typeof cartItems.$inferSelect;
export type WishlistRow = typeof wishlists.$inferSelect;
