"use server";

/**
 * Books Server Actions
 * Permission required: books:manage
 */
import { z } from "zod";
import { eq, desc, and, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { books } from "@/db/schema";
import { requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

// ── Validation ─────────────────────────────────────────────────────────────

const bookSchema = z.object({
  name: z.string().min(1, "বইয়ের নাম দিন"),
  edition: z.string().optional(),
  language: z.string().optional(),
  format: z.enum(["hardcover", "paperback", "ebook"]).default("paperback"),
  totalPages: z.coerce.number().int().positive().optional(),
  // Accept price as decimal BDT string (e.g. "150.00"), convert to paisa
  price: z.coerce.number().positive("মূল্য দিন"),
  discountPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPreorder: z.boolean().default(false),
  authorId: z.string().optional(),
  publisherId: z.string().optional(),
  subjectId: z.string().optional(),
});

function generateId() {
  return `book_${Math.random().toString(36).slice(2, 11)}`;
}

function toPaisa(amount: number) {
  return Math.round(amount * 100);
}

// ── Public reads ───────────────────────────────────────────────────────────

export async function getBooksAction(opts?: {
  subjectId?: string;
  authorId?: string;
  publisherId?: string;
  featured?: boolean;
  preorder?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<(typeof books.$inferSelect)[]>> {
  try {
    const conditions = [eq(books.isActive, true)];

    if (opts?.subjectId) conditions.push(eq(books.subjectId, opts.subjectId));
    if (opts?.authorId) conditions.push(eq(books.authorId, opts.authorId));
    if (opts?.publisherId)
      conditions.push(eq(books.publisherId, opts.publisherId));
    if (opts?.featured) conditions.push(eq(books.isFeatured, true));
    if (opts?.preorder) conditions.push(eq(books.isPreorder, true));
    if (opts?.search)
      conditions.push(ilike(books.name, `%${opts.search}%`));

    const rows = await db
      .select()
      .from(books)
      .where(and(...conditions))
      .orderBy(desc(books.createdAt))
      .limit(opts?.limit ?? 24)
      .offset(opts?.offset ?? 0);

    return { data: rows };
  } catch {
    return { error: "বই লোড করা যায়নি" };
  }
}

export async function getBookByIdAction(
  id: string,
): Promise<ActionResult<typeof books.$inferSelect | null>> {
  try {
    const [row] = await db.select().from(books).where(eq(books.id, id));
    return { data: row ?? null };
  } catch {
    return { error: "বই পাওয়া যায়নি" };
  }
}

// ── Staff mutations ────────────────────────────────────────────────────────

export async function createBookAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ books: ["manage"] });

    const raw = {
      name: formData.get("name"),
      edition: formData.get("edition") || undefined,
      language: formData.get("language") || undefined,
      format: formData.get("format") || "paperback",
      totalPages: formData.get("totalPages") || undefined,
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice") || undefined,
      stock: formData.get("stock") || 0,
      imageUrl: formData.get("imageUrl") || undefined,
      description: formData.get("description") || undefined,
      isActive: formData.get("isActive") !== "false",
      isFeatured: formData.get("isFeatured") === "true",
      isPreorder: formData.get("isPreorder") === "true",
      authorId: formData.get("authorId") || undefined,
      publisherId: formData.get("publisherId") || undefined,
      subjectId: formData.get("subjectId") || undefined,
    };

    const parsed = bookSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      return { error: msg };
    }

    const { price, discountPrice, ...rest } = parsed.data;
    const id = generateId();

    await db.insert(books).values({
      id,
      ...rest,
      pricePaisa: toPaisa(price),
      discountPricePaisa: discountPrice ? toPaisa(discountPrice) : null,
      createdBy: session.user.id,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বই তৈরি করা যায়নি" };
  }
}

export async function updateBookAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ books: ["manage"] });

    const raw: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (value !== "") raw[key] = value;
    }

    const parsed = bookSchema.partial().safeParse(raw);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      return { error: msg };
    }

    const { price, discountPrice, ...rest } = parsed.data;
    const updates: Partial<typeof books.$inferInsert> = {
      ...(rest as Partial<typeof books.$inferInsert>),
      updatedAt: new Date(),
    };
    if (price !== undefined) updates.pricePaisa = toPaisa(price);
    if (discountPrice !== undefined)
      updates.discountPricePaisa = toPaisa(discountPrice);

    await db
      .update(books)
      .set(updates)
      .where(eq(books.id, id));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বই আপডেট করা যায়নি" };
  }
}

export async function deleteBookAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ books: ["manage"] });
    await db.delete(books).where(eq(books.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বই মুছে ফেলা যায়নি" };
  }
}
