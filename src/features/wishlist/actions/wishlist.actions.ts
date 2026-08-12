"use server";

/**
 * Server Actions for Database-backed Wishlist
 */
import { eq, and, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { wishlists, books, authors } from "@/db/schema";
import { requireAuth, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

export interface DBWishlistItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

// ── Get Wishlist ───────────────────────────────────────────────────────────
export async function getWishlistAction(): Promise<
  ActionResult<DBWishlistItem[]>
> {
  try {
    const session = await requireAuth();

    const rows = await db
      .select({
        wishlistId: wishlists.id,
        bookId: books.id,
        bookName: books.name,
        pricePaisa: books.pricePaisa,
        discountPricePaisa: books.discountPricePaisa,
        imageUrl: books.imageUrl,
        authorId: books.authorId,
      })
      .from(wishlists)
      .innerJoin(books, eq(wishlists.bookId, books.id))
      .where(eq(wishlists.userId, session.user.id));

    if (!rows.length) {
      return { data: [] };
    }

    // Batch-fetch author names
    const authorIds = [
      ...new Set(rows.map((r) => r.authorId).filter((id): id is string => !!id)),
    ];
    const authorRows = authorIds.length
      ? await db
          .select({ id: authors.id, name: authors.name })
          .from(authors)
          .where(or(...authorIds.map((id) => eq(authors.id, id))))
      : [];
    const authorMap = new Map(authorRows.map((a) => [a.id, a.name]));

    const items: DBWishlistItem[] = rows.map((r) => {
      const price = Math.round(r.pricePaisa / 100);
      const discountPrice = r.discountPricePaisa
        ? Math.round(r.discountPricePaisa / 100)
        : null;
      return {
        id: r.wishlistId,
        bookId: r.bookId,
        title: r.bookName,
        author: authorMap.get(r.authorId ?? "") ?? "",
        currentPrice: discountPrice ?? price,
        originalPrice: price,
        imageUrl: r.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
      };
    });

    return { data: items };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "উইশলিস্ট লোড করা যায়নি" };
  }
}

// ── Add to Wishlist ────────────────────────────────────────────────────────
export async function addToWishlistAction(
  bookId: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth();

    // Check if book exists
    const [book] = await db
      .select({ id: books.id })
      .from(books)
      .where(and(eq(books.id, bookId), eq(books.isActive, true)));

    if (!book) return { error: "বইটি পাওয়া যায়নি" };

    // Check if already in wishlist
    const [existing] = await db
      .select()
      .from(wishlists)
      .where(
        and(eq(wishlists.userId, session.user.id), eq(wishlists.bookId, bookId)),
      );

    if (existing) {
      return { data: { id: existing.id } };
    }

    const newId = generateId("wish");
    await db.insert(wishlists).values({
      id: newId,
      userId: session.user.id,
      bookId,
    });

    return { data: { id: newId } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "উইশলিস্টে যোগ করা যায়নি" };
  }
}

// ── Remove from Wishlist ───────────────────────────────────────────────────
export async function removeFromWishlistAction(
  targetId: string, // wishlistId or bookId
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    await db
      .delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, session.user.id),
          or(eq(wishlists.id, targetId), eq(wishlists.bookId, targetId)),
        ),
      );

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "উইশলিস্ট থেকে মোছা যায়নি" };
  }
}
