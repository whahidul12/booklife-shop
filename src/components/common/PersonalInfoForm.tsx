"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  updateProfileAction,
  getProfileAction,
} from "@/features/users/actions/profile.actions";

const initialState: { error?: string; data?: undefined } = {};

const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
const BLOOD_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export function PersonalInfoForm() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [extras, setExtras] = useState({
    gender: "Male",
    bloodGroup: "B+",
    phone: "",
  });
  const [extrasLoaded, setExtrasLoaded] = useState(false);

  // Load saved phone / gender / bloodGroup from DB on mount
  useEffect(() => {
    if (!session?.user) return;
    getProfileAction().then((res) => {
      if (res.data) {
        setExtras({
          gender: res.data.gender ?? "Male",
          bloodGroup: res.data.bloodGroup ?? "B+",
          phone: res.data.phone ?? "",
        });
      }
      setExtrasLoaded(true);
    });
  }, [session?.user]);

  const [saveState, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setExtras((p) => ({ ...p, [e.target.name]: e.target.value }));

  const isLoading = sessionLoading || !extrasLoaded;

  return (
    <form action={formAction} className="space-y-8">
      {/* Error */}
      {saveState.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {saveState.error}
        </div>
      )}

      {/* ── Personal Information ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Personal Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm text-gray-500" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              key={session?.user?.name ?? ""}
              defaultValue={session?.user?.name ?? ""}
              disabled={isLoading || isPending}
              required
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-60"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm text-gray-500" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={extras.gender}
              onChange={handleChange}
              disabled={isLoading || isPending}
              className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-60"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Blood group */}
          <div className="space-y-2">
            <label className="text-sm text-gray-500" htmlFor="bloodGroup">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={extras.bloodGroup}
              onChange={handleChange}
              disabled={isLoading || isPending}
              className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-60"
            >
              {BLOOD_OPTIONS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ── Mobile Number ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Mobile Number
        </h2>
        <div className="max-w-md space-y-2">
          <label className="text-sm text-gray-500" htmlFor="phone">
            Phone / Mobile
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={extras.phone}
            onChange={handleChange}
            disabled={isLoading || isPending}
            placeholder="+880XXXXXXXXXX"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-60"
          />
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ── Email (read-only) ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Email Address
        </h2>
        <div className="max-w-md space-y-2">
          <label className="text-sm text-gray-500">Email Address</label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            readOnly
            className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 outline-none"
          />
          <p className="text-xs text-gray-400">ইমেইল পরিবর্তন করা যাবে না।</p>
        </div>
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || isLoading}
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isPending ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
        </button>
        {!saveState.error && saveState.data === null && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="size-4" />
            সংরক্ষিত হয়েছে
          </span>
        )}
      </div>
    </form>
  );
}
