"use server";

/**
 * Server Actions for Database-backed Cart
 */
import { eq, and, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, books, authors } from "@/db/schema";
import { requireAuth, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

export interface DBCartItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  currentPrice: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string;
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

// ── Get Cart ───────────────────────────────────────────────────────────────
export async function getCartAction(): Promise<ActionResult<DBCartItem[]>> {
  try {
    const session = await requireAuth();

    const rows = await db
      .select({
        cartItemId: cartItems.id,
        quantity: cartItems.quantity,
        bookId: books.id,
        bookName: books.name,
        pricePaisa: books.pricePaisa,
        discountPricePaisa: books.discountPricePaisa,
        imageUrl: books.imageUrl,
        authorId: books.authorId,
      })
      .from(cartItems)
      .innerJoin(books, eq(cartItems.bookId, books.id))
      .where(eq(cartItems.userId, session.user.id));

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

    const items: DBCartItem[] = rows.map((r) => {
      const price = Math.round(r.pricePaisa / 100);
      const discountPrice = r.discountPricePaisa
        ? Math.round(r.discountPricePaisa / 100)
        : null;
      return {
        id: r.cartItemId,
        bookId: r.bookId,
        title: r.bookName,
        author: authorMap.get(r.authorId ?? "") ?? "",
        currentPrice: discountPrice ?? price,
        originalPrice: price,
        quantity: r.quantity,
        imageUrl: r.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
      };
    });

    return { data: items };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কার্ট লোড করা যায়নি" };
  }
}

// ── Add to Cart ────────────────────────────────────────────────────────────
export async function addToCartAction(
  bookId: string,
  quantity = 1,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth();

    // Check if book exists
    const [book] = await db
      .select({ id: books.id })
      .from(books)
      .where(and(eq(books.id, bookId), eq(books.isActive, true)));

    if (!book) return { error: "বইটি পাওয়া যায়নি" };

    // Check if already in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.userId, session.user.id), eq(cartItems.bookId, bookId)),
      );

    if (existing) {
      const newQty = existing.quantity + quantity;
      await db
        .update(cartItems)
        .set({ quantity: newQty, updatedAt: new Date() })
        .where(eq(cartItems.id, existing.id));
      return { data: { id: existing.id } };
    }

    const newId = generateId("cart");
    await db.insert(cartItems).values({
      id: newId,
      userId: session.user.id,
      bookId,
      quantity,
    });

    return { data: { id: newId } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কার্টে যোগ করা যায়নি" };
  }
}

// ── Update Cart Item Quantity ─────────────────────────────────────────────
export async function updateCartQuantityAction(
  targetId: string, // cartItemId or bookId
  value: number, // delta or new quantity
  isAbsolute = false,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    const [item] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, session.user.id),
          or(eq(cartItems.id, targetId), eq(cartItems.bookId, targetId)),
        ),
      );

    if (!item) return { error: "কার্ট আইটেম পাওয়া যায়নি" };

    const newQty = isAbsolute ? value : item.quantity + value;

    if (newQty <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, item.id));
    } else {
      await db
        .update(cartItems)
        .set({ quantity: newQty, updatedAt: new Date() })
        .where(eq(cartItems.id, item.id));
    }

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "পরিমাণ পরিবর্তন করা যায়নি" };
  }
}

// ── Remove from Cart ───────────────────────────────────────────────────────
export async function removeFromCartAction(
  targetId: string, // cartItemId or bookId
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.userId, session.user.id),
          or(eq(cartItems.id, targetId), eq(cartItems.bookId, targetId)),
        ),
      );

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "আইটেম মোছা যায়নি" };
  }
}

// ── Clear Cart ─────────────────────────────────────────────────────────────
export async function clearCartAction(): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "কার্ট খালি করা যায়নি" };
  }
}
