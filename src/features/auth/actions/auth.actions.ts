"use server";

/**
 * Auth Server Actions — sign-up, sign-in, sign-out.
 *
 * These call auth.api.* directly (server-side) so cookies are set
 * automatically via the nextCookies() plugin.
 */
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-guard";

// Validation schemas

const signUpSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে"),
});

const signInSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

// Sign Up

export async function signUpAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const messages = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(", ");
    return { error: messages };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    return { data: { userId: result.user.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "নিবন্ধন ব্যর্থ হয়েছে";
    return { error: message };
  }
}

// Sign In

export async function signInAction(
  _: unknown,
  formData: FormData,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const messages = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(", ");
    return { error: messages };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    return { data: { userId: result.user.id } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "ইমেইল বা পাসওয়ার্ড ভুল";
    return { error: message };
  }
}

// Sign Out

export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/sign-in");
}

// Get current session (for RSC use)

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
