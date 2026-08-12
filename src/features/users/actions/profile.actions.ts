"use server";

/**
 * User Profile Server Actions
 *
 * updateProfileAction  — saves name (via BetterAuth) + phone/gender/bloodGroup
 *                        (via user_profile table, upsert).
 * getProfileAction     — fetches the extended profile row for the current user.
 * changePasswordAction — changes password via BetterAuth.
 */
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfiles } from "@/db/schema";
import { headers } from "next/headers";
import { requireAuth, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";
import type { UserProfile } from "@/db/schema";

// ── Validation ─────────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে").max(100),
  phone: z.string().max(20).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
});

// ── Get extended profile ───────────────────────────────────────────────────

export async function getProfileAction(): Promise<
  ActionResult<UserProfile | null>
> {
  try {
    const session = await requireAuth();
    const [row] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id));
    return { data: row ?? null };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "প্রোফাইল লোড করা যায়নি" };
  }
}

// ── Update profile (name + extended fields) ────────────────────────────────

export async function updateProfileAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    const session = await requireAuth();

    const parsed = updateProfileSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone") || undefined,
      gender: formData.get("gender") || undefined,
      bloodGroup: formData.get("bloodGroup") || undefined,
    });

    if (!parsed.success) {
      return {
        error: Object.values(parsed.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      };
    }

    // 1. Update BetterAuth user name
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: await headers(),
    });

    // 2. Upsert extended profile (phone / gender / bloodGroup)
    const existing = await db
      .select({ userId: userProfiles.userId })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id));

    if (existing.length > 0) {
      await db
        .update(userProfiles)
        .set({
          phone: parsed.data.phone ?? null,
          gender: parsed.data.gender ?? null,
          bloodGroup: parsed.data.bloodGroup ?? null,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, session.user.id));
    } else {
      await db.insert(userProfiles).values({
        userId: session.user.id,
        phone: parsed.data.phone ?? null,
        gender: parsed.data.gender ?? null,
        bloodGroup: parsed.data.bloodGroup ?? null,
      });
    }

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    return { error: "প্রোফাইল আপডেট করা যায়নি" };
  }
}

// ── Change password ────────────────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    newPassword: z.string().min(8, "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "নতুন পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    await requireAuth();

    const parsed = changePasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      const msgs = parsed.error.issues.map((e) => e.message).join(", ");
      return { error: msgs };
    }

    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return { data: undefined };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    const msg =
      err instanceof Error ? err.message : "পাসওয়ার্ড পরিবর্তন করা যায়নি";
    return { error: msg };
  }
}
