"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/features/auth/actions/auth.actions";

const initialState: { error?: string; data?: { userId: string } } = {};

export function SignUpForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  // Redirect to home after successful registration
  useEffect(() => {
    if (state.data) {
      router.push("/");
      router.refresh();
    }
  }, [state.data, router]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Global error banner */}
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          পূর্ণ নাম
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="আপনার নাম"
          required
          className="h-10"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          ইমেইল
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          required
          className="h-10"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          পাসওয়ার্ড
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          required
          minLength={8}
          className="h-10"
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
      >
        {isPending ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        ইতোমধ্যে একাউন্ট আছে?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-red-600 hover:underline"
        >
          লগইন করুন
        </Link>
      </p>
    </form>
  );
}
