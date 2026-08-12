"use client";

import { useActionState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import { changePasswordAction } from "@/features/users/actions/profile.actions";

const initialState: { error?: string; data?: undefined } = {};

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        পাসওয়ার্ড পরিবর্তন
      </h2>

      {state.error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      {/* Success: state.data !== undefined means action returned { data: undefined } */}
      {state.data === null && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="size-4 shrink-0" />
          পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে
        </div>
      )}

      <form action={formAction} className="max-w-md space-y-5">
        {/* Current password */}
        <div className="space-y-1.5">
          <label
            htmlFor="currentPassword"
            className="block text-sm text-gray-500"
          >
            বর্তমান পাসওয়ার্ড
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              disabled={isPending}
              className="w-full rounded-md border border-gray-200 px-4 py-2 pr-10 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showCurrent ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showCurrent ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="block text-sm text-gray-500"
          >
            নতুন পাসওয়ার্ড{" "}
            <span className="text-xs text-gray-400">(কমপক্ষে ৮ অক্ষর)</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              required
              minLength={8}
              disabled={isPending}
              className="w-full rounded-md border border-gray-200 px-4 py-2 pr-10 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showNew ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showNew ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-500"
          >
            নতুন পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              disabled={isPending}
              className="w-full rounded-md border border-gray-200 px-4 py-2 pr-10 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isPending ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
        </button>
      </form>
    </div>
  );
}
