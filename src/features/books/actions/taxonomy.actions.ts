"use server";

/**
 * Authors & Publishers Server Actions
 * Permission required: authors:manage / publishers:manage
 */
import { z } from "zod";
import { eq, asc, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { authors, publishers } from "@/db/schema";
import { requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

// ── Author schemas ─────────────────────────────────────────────────────────

const authorSchema = z.object({
  name: z.string().min(1, "লেখকের নাম দিন"),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

// ── Publisher schemas ──────────────────────────────────────────────────────

const publisherSchema = z.object({
  name: z.string().min(1, "প্রকাশনীর নাম দিন"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

// ── Authors — Public reads ─────────────────────────────────────────────────

export async function getAuthorsAction(): Promise<
  ActionResult<(typeof authors.$inferSelect)[]>
> {
  try {
    const rows = await db
      .select()
      .from(authors)
      .orderBy(asc(authors.name));
    return { data: rows };
  } catch {
    return { error: "লেখক লোড করা যায়নি" };
  }
}

export async function searchAuthorsAction(
  query: string,
): Promise<ActionResult<(typeof authors.$inferSelect)[]>> {
  try {
    const rows = await db
      .select()
      .from(authors)
      .where(ilike(authors.name, `%${query}%`))
      .orderBy(asc(authors.name));
    return { data: rows };
  } catch {
    return { error: "লেখক অনুসন্ধান ব্যর্থ হয়েছে" };
  }
}

// ── Authors — Staff mutations ──────────────────────────────────────────────

export async function createAuthorAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ authors: ["manage"] });
    const parsed = authorSchema.safeParse({
      name: formData.get("name"),
      bio: formData.get("bio") || undefined,
      imageUrl: formData.get("imageUrl") || undefined,
    });
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }
    const id = generateId("auth");
    await db.insert(authors).values({ id, ...parsed.data, createdBy: session.user.id });
    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "লেখক তৈরি করা যায়নি" };
  }
}

export async function updateAuthorAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ authors: ["manage"] });
    const parsed = authorSchema.partial().safeParse({
      name: formData.get("name") || undefined,
      bio: formData.get("bio") || undefined,
      imageUrl: formData.get("imageUrl") || undefined,
    });
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }
    await db
      .update(authors)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(authors.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "লেখক আপডেট করা যায়নি" };
  }
}

export async function deleteAuthorAction(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission({ authors: ["manage"] });
    await db.delete(authors).where(eq(authors.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "লেখক মুছে ফেলা যায়নি" };
  }
}

// ── Publishers — Public reads ──────────────────────────────────────────────

export async function getPublishersAction(): Promise<
  ActionResult<(typeof publishers.$inferSelect)[]>
> {
  try {
    const rows = await db.select().from(publishers).orderBy(asc(publishers.name));
    return { data: rows };
  } catch {
    return { error: "প্রকাশনী লোড করা যায়নি" };
  }
}

// ── Publishers — Staff mutations ───────────────────────────────────────────

export async function createPublisherAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ publishers: ["manage"] });
    const parsed = publisherSchema.safeParse({
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl") || undefined,
    });
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }
    const id = generateId("pub");
    await db.insert(publishers).values({ id, ...parsed.data, createdBy: session.user.id });
    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "প্রকাশনী তৈরি করা যায়নি" };
  }
}

export async function updatePublisherAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ publishers: ["manage"] });
    const parsed = publisherSchema.partial().safeParse({
      name: formData.get("name") || undefined,
      logoUrl: formData.get("logoUrl") || undefined,
    });
    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      };
    }
    await db
      .update(publishers)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(publishers.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "প্রকাশনী আপডেট করা যায়নি" };
  }
}

export async function deletePublisherAction(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission({ publishers: ["manage"] });
    await db.delete(publishers).where(eq(publishers.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "প্রকাশনী মুছে ফেলা যায়নি" };
  }
}
