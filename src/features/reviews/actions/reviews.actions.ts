"use server";

/**
 * Reviews Server Actions
 * - Verified customers can submit reviews
 * - Moderators (reviews:moderate) can hide / unhide reviews
 */
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { requireAuth, requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

function generateId() {
  return `rev_${Math.random().toString(36).slice(2, 11)}`;
}

const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

// ── Public reads ───────────────────────────────────────────────────────────

export async function getBookReviewsAction(
  bookId: string,
): Promise<ActionResult<(typeof reviews.$inferSelect)[]>> {
  try {
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.bookId, bookId), eq(reviews.isHidden, false)))
      .orderBy(desc(reviews.createdAt));
    return { data: rows };
  } catch {
    return { error: "রিভিউ লোড করা যায়নি" };
  }
}

// ── Customer — submit review ───────────────────────────────────────────────

export async function submitReviewAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth();

    const parsed = reviewSchema.safeParse({
      bookId: formData.get("bookId"),
      rating: formData.get("rating"),
      comment: formData.get("comment") || undefined,
    });
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }

    const id = generateId();
    await db.insert(reviews).values({
      id,
      ...parsed.data,
      userId: session.user.id,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ জমা দেওয়া যায়নি" };
  }
}

// ── Moderator — hide review ────────────────────────────────────────────────

export async function hideReviewAction(
  reviewId: string,
): Promise<ActionResult<void>> {
  try {
    const session = await requirePermission({ reviews: ["moderate"] });
    await db
      .update(reviews)
      .set({
        isHidden: true,
        hiddenAt: new Date(),
        hiddenBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ লুকানো যায়নি" };
  }
}

export async function unhideReviewAction(
  reviewId: string,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ reviews: ["moderate"] });
    await db
      .update(reviews)
      .set({
        isHidden: false,
        hiddenAt: null,
        hiddenBy: null,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ দেখানো যায়নি" };
  }
}

// ── Customer — list own reviews ───────────────────────────────────────────

export async function getMyReviewsAction(): Promise<
  ActionResult<(typeof reviews.$inferSelect)[]>
> {
  try {
    const session = await requireAuth();
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, session.user.id))
      .orderBy(desc(reviews.createdAt));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ লোড করা যায়নি" };
  }
}

// ── Moderator — list all reviews (including hidden) ───────────────────────

export async function getAllReviewsAction(): Promise<
  ActionResult<(typeof reviews.$inferSelect)[]>
> {
  try {
    await requirePermission({ reviews: ["moderate"] });
    const rows = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));
    return { data: rows };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ লোড করা যায়নি" };
  }
}

// ── Moderator — update review ─────────────────────────────────────────────

export async function updateReviewAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ reviews: ["moderate"] });
    const rating = formData.get("rating") ? Number(formData.get("rating")) : undefined;
    const comment = formData.get("comment") !== null ? String(formData.get("comment")) : undefined;
    const isHidden = formData.get("isHidden") === "true";

    const updates: Partial<typeof reviews.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (rating !== undefined && rating >= 1 && rating <= 5) updates.rating = rating;
    if (comment !== undefined) updates.comment = comment || null;
    updates.isHidden = isHidden;

    await db.update(reviews).set(updates).where(eq(reviews.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ আপডেট করা যায়নি" };
  }
}

// ── Moderator — delete review ─────────────────────────────────────────────

export async function deleteReviewAction(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission({ reviews: ["moderate"] });
    await db.delete(reviews).where(eq(reviews.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "রিভিউ মুছে ফেলা যায়নি" };
  }
}
