"use server";

import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, coupons, addresses, cartItems } from "@/db/schema";
import { requireAuth, requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

const DELIVERY_FEE_PAISA = 6500; // ৳65 in paisa

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
}

//  Place order

interface CartItemInput {
  bookId: string;
  bookNameSnapshot: string;
  quantity: number;
  unitPricePaisa: number;
  discountPricePaisa?: number;
}

const placeOrderSchema = z.object({
  addressId: z.string().min(1, "ডেলিভারি ঠিকানা বেছে নিন"),
  paymentMethod: z.string().default("cash_on_delivery"),
  deliveryNote: z.string().max(500).optional(),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        bookId: z.string(),
        bookNameSnapshot: z.string(),
        quantity: z.number().int().positive(),
        unitPricePaisa: z.number().int().positive(),
        discountPricePaisa: z.number().int().positive().optional(),
      }),
    )
    .min(1, "কার্টে কোনো বই নেই"),
});

export async function placeOrderAction(
  input: z.infer<typeof placeOrderSchema>,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const session = await requireAuth();

    const parsed = placeOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }

    const { addressId, paymentMethod, deliveryNote, couponCode, items } =
      parsed.data;

    // Verify address belongs to this user, fallback to existing or auto-create default address
    let [addr] = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)),
      );

    if (!addr) {
      const userAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, session.user.id));

      if (userAddresses.length > 0) {
        addr = userAddresses[0];
      } else {
        const newAddrId = `addr_${Math.random().toString(36).slice(2, 11)}`;
        await db.insert(addresses).values({
          id: newAddrId,
          userId: session.user.id,
          recipientName: session.user.name ?? "Customer",
          phone: "01700000000",
          addressLine1: "House 1, Road 2, Block A",
          city: "Dhaka",
          district: "Dhaka",
          isDefault: true,
        });
        const [created] = await db
          .select()
          .from(addresses)
          .where(eq(addresses.id, newAddrId));
        addr = created;
      }
    }

    // Calculate subtotal (use discountPrice if available, else unitPrice)
    const subtotalPaisa = items.reduce((sum, item) => {
      const effectivePrice = item.discountPricePaisa ?? item.unitPricePaisa;
      return sum + effectivePrice * item.quantity;
    }, 0);

    // Validate and apply coupon
    let couponDiscountPaisa = 0;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const [coupon] = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, couponCode.toUpperCase()), eq(coupons.isActive, true)));

      if (!coupon) return { error: "কুপন কোড অবৈধ বা মেয়াদোত্তীর্ণ" };
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { error: "কুপনের মেয়াদ শেষ হয়ে গেছে" };
      }
      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return { error: "কুপনের সর্বোচ্চ ব্যবহার সীমা অতিক্রান্ত হয়েছে" };
      }

      couponDiscountPaisa = coupon.discountPaisa;
      appliedCouponId = coupon.id;
    }

    const totalPaisa = Math.max(
      0,
      subtotalPaisa - couponDiscountPaisa + DELIVERY_FEE_PAISA,
    );

    const orderId = generateId("ORD");
    const shippingSnapshot = JSON.stringify({
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      district: addr.district,
    });

    // Simulate payment: randomly succeed/fail for non-COD methods
    const paymentStatus =
      paymentMethod === "cash_on_delivery"
        ? "pending"
        : Math.random() > 0.1
          ? "success"
          : "failed";

    // Insert order
    await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      status: "pending",
      paymentStatus,
      paymentMethod,
      shippingAddressSnapshot: shippingSnapshot,
      deliveryNote: deliveryNote ?? null,
      subtotalPaisa,
      deliveryFeePaisa: DELIVERY_FEE_PAISA,
      couponDiscountPaisa,
      totalPaisa,
      couponId: appliedCouponId,
    });

    // Insert order items
    await db.insert(orderItems).values(
      items.map((item) => ({
        id: generateId("OI"),
        orderId,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPricePaisa: item.unitPricePaisa,
        discountPricePaisa: item.discountPricePaisa ?? null,
        bookNameSnapshot: item.bookNameSnapshot,
      })),
    );

    // Increment coupon usage if applied
    if (appliedCouponId) {
      await db
        .update(coupons)
        .set({ usedCount: (await db.select({ c: coupons.usedCount }).from(coupons).where(eq(coupons.id, appliedCouponId)))[0].c + 1 })
        .where(eq(coupons.id, appliedCouponId));
    }

    // Clear user cart in DB after order is placed
    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

    return { data: { orderId } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার দেওয়া যায়নি" };
  }
}

// Customer — view own orders

export async function getMyOrdersAction(): Promise<
  ActionResult<(typeof orders.$inferSelect)[]>
> {
  try {
    const session = await requireAuth();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার লোড করা যায়নি" };
  }
}

// Customer — cancel own order

export async function cancelMyOrderAction(
  orderId: string,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
      );

    if (!order) return { error: "অর্ডার পাওয়া যায়নি" };
    if (!["pending", "confirmed"].includes(order.status)) {
      return { error: "এই অর্ডার বাতিল করা সম্ভব নয়" };
    }

    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার বাতিল করা যায়নি" };
  }
}

// Moderator — update order status

const orderStatusValues = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export async function updateOrderStatusAction(
  orderId: string,
  status: (typeof orderStatusValues)[number],
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ orders: ["update-status"] });

    if (!orderStatusValues.includes(status)) {
      return { error: "অবৈধ অর্ডার স্ট্যাটাস" };
    }

    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার স্ট্যাটাস আপডেট করা যায়নি" };
  }
}

// Moderator — list all orders

export async function getAllOrdersAction(): Promise<
  ActionResult<(typeof orders.$inferSelect)[]>
> {
  try {
    await requirePermission({ orders: ["view"] });
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার লোড করা যায়নি" };
  }
}

export async function getOrderDetailsWithItemsAction(
  orderId: string,
): Promise<
  ActionResult<{
    order: typeof orders.$inferSelect;
    items: (typeof orderItems.$inferSelect)[];
  }>
> {
  try {
    await requirePermission({ orders: ["view"] });
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) return { error: "অর্ডার পাওয়া যায়নি" };

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return { data: { order, items } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার বিবরণ লোড করা যায়নি" };
  }
}

export async function deleteOrderAction(
  orderId: string,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ orders: ["cancel"] });
    await db.delete(orders).where(eq(orders.id, orderId));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "অর্ডার মুছে ফেলা যায়নি" };
  }
}

