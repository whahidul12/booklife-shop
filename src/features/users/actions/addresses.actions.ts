"use server";

/**
 * Address Server Actions — fully wired to Neon DB.
 * All mutations enforce that the address belongs to the requesting user.
 */
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { addresses } from "@/db/schema";
import { requireAuth, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

function generateId() {
  return `addr_${Math.random().toString(36).slice(2, 11)}`;
}

const addressSchema = z.object({
  label: z.string().max(50).optional(),
  recipientName: z.string().min(2, "প্রাপকের নাম দিন"),
  phone: z.string().min(6, "ফোন নম্বর দিন"),
  addressLine1: z.string().min(3, "ঠিকানা দিন"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "শহর দিন"),
  district: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// ── Get user addresses ─────────────────────────────────────────────────────

export async function getMyAddressesAction(): Promise<
  ActionResult<(typeof addresses.$inferSelect)[]>
> {
  try {
    const session = await requireAuth();
    const rows = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ঠিকানা লোড করা যায়নি" };
  }
}

// ── Add address ────────────────────────────────────────────────────────────

export async function addAddressAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth();

    const parsed = addressSchema.safeParse({
      label: formData.get("label") || undefined,
      recipientName: formData.get("recipientName"),
      phone: formData.get("phone"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || undefined,
      city: formData.get("city"),
      district: formData.get("district") || undefined,
      isDefault: formData.get("isDefault") === "true",
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      };
    }

    const id = generateId();

    // If this is the default address, clear default on all others first
    if (parsed.data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id));
    }

    await db.insert(addresses).values({
      id,
      userId: session.user.id,
      ...parsed.data,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ঠিকানা যোগ করা যায়নি" };
  }
}

// ── Update address ─────────────────────────────────────────────────────────

export async function updateAddressAction(
  addressId: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    const parsed = addressSchema.partial().safeParse({
      label: formData.get("label") || undefined,
      recipientName: formData.get("recipientName") || undefined,
      phone: formData.get("phone") || undefined,
      addressLine1: formData.get("addressLine1") || undefined,
      addressLine2: formData.get("addressLine2") || undefined,
      city: formData.get("city") || undefined,
      district: formData.get("district") || undefined,
      isDefault:
        formData.get("isDefault") !== null
          ? formData.get("isDefault") === "true"
          : undefined,
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      };
    }

    // Ensure the address belongs to this user
    const [existing] = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(
        and(
          eq(addresses.id, addressId),
          eq(addresses.userId, session.user.id),
        ),
      );
    if (!existing) return { error: "ঠিকানা পাওয়া যায়নি" };

    // Clear other defaults if setting this as default
    if (parsed.data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id));
    }

    await db
      .update(addresses)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(addresses.id, addressId));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ঠিকানা আপডেট করা যায়নি" };
  }
}

// ── Delete address ─────────────────────────────────────────────────────────

export async function deleteAddressAction(
  addressId: string,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    await db
      .delete(addresses)
      .where(
        and(
          eq(addresses.id, addressId),
          eq(addresses.userId, session.user.id),
        ),
      );

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ঠিকানা মুছে ফেলা যায়নি" };
  }
}

// ── Set default address ────────────────────────────────────────────────────

export async function setDefaultAddressAction(
  addressId: string,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    // Verify ownership
    const [existing] = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(
        and(
          eq(addresses.id, addressId),
          eq(addresses.userId, session.user.id),
        ),
      );
    if (!existing) return { error: "ঠিকানা পাওয়া যায়নি" };

    // Clear all defaults for this user
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id));

    // Set the chosen one as default
    await db
      .update(addresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(addresses.id, addressId));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ডিফল্ট ঠিকানা সেট করা যায়নি" };
  }
}
