"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "নিবন্ধন ব্যর্থ হয়েছে");
        setIsPending(false);
        return;
      }

      if (data) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "নিবন্ধন ব্যর্থ হয়েছে");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        className="h-10 w-full bg-red-600 text-white hover:bg-red-700 cursor-pointer font-semibold shadow-sm"
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
