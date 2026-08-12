"use server";

/**
 * Coupons Server Actions
 * Permission required: coupons:manage
 */
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { coupons } from "@/db/schema";
import { requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

function generateId() {
  return `cpn_${Math.random().toString(36).slice(2, 11)}`;
}

const couponSchema = z.object({
  // Code stored uppercase
  code: z
    .string()
    .min(3, "কুপন কোড কমপক্ষে ৩ অক্ষর")
    .max(32)
    .transform((v) => v.toUpperCase()),
  // Discount in BDT (converted to paisa on insert)
  discountTaka: z.coerce.number().positive("ছাড়ের পরিমাণ দিন"),
  maxUses: z.coerce.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

// ── Public — validate coupon (used during checkout) ────────────────────────

export async function validateCouponAction(
  code: string,
): Promise<ActionResult<{ discountTaka: number; couponId: string }>> {
  try {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()));

    if (!coupon || !coupon.isActive) {
      return { error: "কুপন কোড পাওয়া যায়নি বা নিষ্ক্রিয়" };
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { error: "কুপনের মেয়াদ শেষ হয়ে গেছে" };
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return { error: "কুপনের সর্বোচ্চ ব্যবহার সীমা অতিক্রান্ত হয়েছে" };
    }

    return {
      data: {
        discountTaka: coupon.discountPaisa / 100,
        couponId: coupon.id,
      },
    };
  } catch {
    return { error: "কুপন যাচাই করা যায়নি" };
  }
}

// ── Staff — list all coupons ───────────────────────────────────────────────

export async function getCouponsAction(): Promise<
  ActionResult<(typeof coupons.$inferSelect)[]>
> {
  try {
    await requirePermission({ coupons: ["manage"] });
    const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কুপন লোড করা যায়নি" };
  }
}

// ── Staff — create coupon ──────────────────────────────────────────────────

export async function createCouponAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ coupons: ["manage"] });

    const parsed = couponSchema.safeParse({
      code: formData.get("code"),
      discountTaka: formData.get("discountTaka"),
      maxUses: formData.get("maxUses") || undefined,
      expiresAt: formData.get("expiresAt") || undefined,
      isActive: formData.get("isActive") !== "false",
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }

    const id = generateId();
    await db.insert(coupons).values({
      id,
      code: parsed.data.code,
      discountPaisa: Math.round(parsed.data.discountTaka * 100),
      maxUses: parsed.data.maxUses ?? null,
      expiresAt: parsed.data.expiresAt ?? null,
      isActive: parsed.data.isActive,
      createdBy: session.user.id,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কুপন তৈরি করা যায়নি" };
  }
}

// ── Staff — delete coupon ──────────────────────────────────────────────────

export async function deleteCouponAction(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission({ coupons: ["manage"] });
    await db.delete(coupons).where(eq(coupons.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কুপন মুছে ফেলা যায়নি" };
  }
}

// ── Staff — toggle active ──────────────────────────────────────────────────

export async function toggleCouponActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ coupons: ["manage"] });
    await db
      .update(coupons)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(coupons.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কুপন আপডেট করা যায়নি" };
  }
}
