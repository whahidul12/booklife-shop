"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "ইমেইল বা পাসওয়ার্ড ভুল");
        setIsPending(false);
        return;
      }

      if (data) {
        // Full navigation to ensure both server cookies and client session state are freshly initialized
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "লগইন ব্যর্থ হয়েছে");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Global error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="h-10"
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-10 w-full bg-red-600 text-white hover:bg-red-700 cursor-pointer font-semibold shadow-sm"
      >
        {isPending ? "লগইন হচ্ছে..." : "লগইন করুন"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        একাউন্ট নেই?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-red-600 hover:underline"
        >
          নিবন্ধন করুন
        </Link>
      </p>
    </form>
  );
}
