"use server";

/**
 * Subjects Server Actions
 * Permission required: subjects:manage (admin or subjects_mod role)
 */
import { z } from "zod";
import { eq, asc, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { subjects } from "@/db/schema";
import { requirePermission, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

// ── Validation ─────────────────────────────────────────────────────────────

const subjectSchema = z.object({
  title: z.string().min(1, "বিষয়ের নাম দিন"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug শুধু lowercase letters, numbers, hyphens"),
  isActive: z.boolean().default(true),
  sortOrder: z.string().default("0"),
});

function generateId() {
  return `sub_${Math.random().toString(36).slice(2, 11)}`;
}

// ── Public reads (no auth required) ───────────────────────────────────────

/** Fetch all active subjects sorted by sortOrder for the UI carousel / listing */
export async function getActiveSubjectsAction(): Promise<
  ActionResult<{ id: string; title: string; slug: string }[]>
> {
  try {
    const rows = await db
      .select({ id: subjects.id, title: subjects.title, slug: subjects.slug })
      .from(subjects)
      .where(eq(subjects.isActive, true))
      .orderBy(asc(subjects.sortOrder), asc(subjects.title));
    return { data: rows };
  } catch (err) {
    return { error: "বিষয় লোড করা যায়নি" };
  }
}

/** Search subjects by title (Bangla-aware case-insensitive via ilike) */
export async function searchSubjectsAction(
  query: string,
): Promise<ActionResult<{ id: string; title: string; slug: string }[]>> {
  try {
    const rows = await db
      .select({ id: subjects.id, title: subjects.title, slug: subjects.slug })
      .from(subjects)
      .where(ilike(subjects.title, `%${query}%`))
      .orderBy(asc(subjects.title));
    return { data: rows };
  } catch (err) {
    return { error: "অনুসন্ধান ব্যর্থ হয়েছে" };
  }
}

// ── Staff mutations (requires subjects:manage) ─────────────────────────────

export async function createSubjectAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requirePermission({ subjects: ["manage"] });

    const parsed = subjectSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      isActive: formData.get("isActive") !== "false",
      sortOrder: formData.get("sortOrder") ?? "0",
    });

    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      return { error: msg };
    }

    const id = generateId();
    await db.insert(subjects).values({
      id,
      ...parsed.data,
      createdBy: session.user.id,
    });

    return { data: { id } };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বিষয় তৈরি করা যায়নি" };
  }
}

export async function updateSubjectAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ subjects: ["manage"] });

    const parsed = subjectSchema.partial().safeParse({
      title: formData.get("title") ?? undefined,
      slug: formData.get("slug") ?? undefined,
      isActive:
        formData.get("isActive") !== null
          ? formData.get("isActive") !== "false"
          : undefined,
      sortOrder: formData.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      return { error: msg };
    }

    await db
      .update(subjects)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(subjects.id, id));

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বিষয় আপডেট করা যায়নি" };
  }
}

export async function deleteSubjectAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await requirePermission({ subjects: ["manage"] });
    await db.delete(subjects).where(eq(subjects.id, id));
    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "বিষয় মুছে ফেলা যায়নি" };
  }
}
