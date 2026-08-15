"use server";

/**
 * Banners Server Actions — dynamic hero & category carousel management.
 * Permission required: marketing:manage
 */
import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { banners } from "@/db/schema";
import { requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

function generateId() {
  return `bnr_${Math.random().toString(36).slice(2, 11)}`;
}

const bannerSchema = z.object({
  type: z.enum(["hero", "category"]).default("hero"),
  title: z.string().optional(),
  imageUrl: z.string().url("সঠিক ইমেজ URL দিন"),
  mobileImageUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

// ── Public reads ───────────────────────────────────────────────────────────

/** Fetch active hero banners sorted by sortOrder — used by HeroCarousel */
export async function getHeroBannersAction(): Promise<
  ActionResult<(typeof banners.$inferSelect)[]>
> {
  try {
    const rows = await db
      .select()
      .from(banners)
      .where(and(eq(banners.type, "hero"), eq(banners.isActive, true)))
      .orderBy(asc(banners.sortOrder));
    return { data: rows };
  } catch {
    return { error: "ব্যানার লোড করা যায়নি" };
  }
}

/** Fetch active category banners — used by CategoryCarousel if needed */
export async function getCategoryBannersAction(): Promise<
  ActionResult<(typeof banners.$inferSelect)[]>
> {
  try {
    const rows = await db
      .select()
      .from(banners)
      .where(and(eq(banners.type, "category"), eq(banners.isActive, true)))
      .orderBy(asc(banners.sortOrder));
    return { data: rows };
  } catch {
    return { error: "ক্যাটাগরি ব্যানার লোড করা যায়নি" };
  }
}

// ── Staff mutations ────────────────────────────────────────────────────────

export async function getAllBannersAction(): Promise<
  ActionResult<(typeof banners.$inferSelect)[]>
> {
  try {
    await requirePermission({ marketing: ["manage"] });
    const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ব্যানার লোড করা যায়নি" };
  }
}

export async function createBannerAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ marketing: ["manage"] });

    const parsed = bannerSchema.safeParse({
      type: formData.get("type") || "hero",
      title: formData.get("title") || undefined,
      imageUrl: formData.get("imageUrl"),
      mobileImageUrl: formData.get("mobileImageUrl") || undefined,
      linkUrl: formData.get("linkUrl") || undefined,
      isActive: formData.get("isActive") !== "false",
      sortOrder: formData.get("sortOrder") || 0,
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }

    const id = generateId();
    await db.insert(banners).values({
      id,
      ...parsed.data,
      mobileImageUrl: parsed.data.mobileImageUrl || null,
      linkUrl: parsed.data.linkUrl || null,
      createdBy: session.user.id,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ব্যানার তৈরি করা যায়নি" };
  }
}

export async function updateBannerAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    const session = await requirePermission({ marketing: ["manage"] });

    const parsed = bannerSchema.partial().safeParse({
      type: formData.get("type") || undefined,
      title: formData.get("title") || undefined,
      imageUrl: formData.get("imageUrl") || undefined,
      mobileImageUrl: formData.get("mobileImageUrl") || undefined,
      linkUrl: formData.get("linkUrl") || undefined,
      isActive:
        formData.get("isActive") !== null
          ? formData.get("isActive") !== "false"
          : undefined,
      sortOrder: formData.get("sortOrder") || undefined,
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }

    await db
      .update(banners)
      .set({ ...parsed.data, updatedAt: new Date(), updatedBy: session.user.id })
      .where(eq(banners.id, id));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ব্যানার আপডেট করা যায়নি" };
  }
}

export async function toggleBannerActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult<void>> {
  try {
    const session = await requirePermission({ marketing: ["manage"] });
    await db
      .update(banners)
      .set({ isActive, updatedAt: new Date(), updatedBy: session.user.id })
      .where(eq(banners.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ব্যানার স্ট্যাটাস পরিবর্তন করা যায়নি" };
  }
}

export async function deleteBannerAction(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission({ marketing: ["manage"] });
    await db.delete(banners).where(eq(banners.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "ব্যানার মুছে ফেলা যায়নি" };
  }
}


