"use client";

/**
 * AdminPermissionsPage
 *
 * Admin-only page. Shows every user with role="moderator" and renders
 * a grid of permission checkboxes for each one. Toggling a checkbox
 * immediately calls setModeratorPermissionsAction — no separate save button
 * needed per-cell (optimistic UI with error rollback).
 *
 * Layout:
 *   ┌──────────────┬──────────┬──────────┬ … ┐
 *   │ Moderator    │ Books    │ Reviews  │   │
 *   ├──────────────┼──────────┼──────────┼ … ┤
 *   │ User A       │  ✓       │          │   │
 *   │ User B       │          │  ✓       │   │
 *   └──────────────┴──────────┴──────────┴───┘
 */
import { useEffect, useState, useCallback } from "react";
import { RefreshCw, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import {
  getAllModeratorsWithPermissionsAction,
  setModeratorPermissionsAction,
  type ModeratorWithPermissions,
  type PermissionUpdate,
} from "@/features/permissions/actions/permissions.actions";
import { PERMISSION_FIELDS } from "@/db/schema/moderator-permissions.schema";
import type { ModeratorPermission } from "@/db/schema";

type PermKey = keyof Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">;

export function AdminPermissionsPage() {
  const [moderators, setModerators] = useState<ModeratorWithPermissions[]>([]);
  const [loading, setLoading]       = useState(true);
  const [savingKey, setSavingKey]   = useState<string | null>(null); // "userId:field"
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [loadError, setLoadError]   = useState<string | null>(null);

  // ── Load ────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await getAllModeratorsWithPermissionsAction();
    if (res.error) setLoadError(res.error);
    else setModerators(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Show toast for 2.5 s ────────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Toggle a single permission ──────────────────────────────────────────
  async function handleToggle(
    moderator: ModeratorWithPermissions,
    field: PermKey,
  ) {
    const cellKey = `${moderator.id}:${field}`;
    const newValue = !moderator.permissions[field];

    // Optimistic update
    setModerators((prev) =>
      prev.map((m) =>
        m.id === moderator.id
          ? { ...m, permissions: { ...m.permissions, [field]: newValue } }
          : m,
      ),
    );

    setSavingKey(cellKey);
    const res = await setModeratorPermissionsAction(
      moderator.id,
      { [field]: newValue } as PermissionUpdate,
    );
    setSavingKey(null);

    if (res.error) {
      // Roll back on error
      setModerators((prev) =>
        prev.map((m) =>
          m.id === moderator.id
            ? { ...m, permissions: { ...m.permissions, [field]: !newValue } }
            : m,
        ),
      );
      showToast(res.error, false);
    } else {
      showToast(
        `${moderator.name} — ${PERMISSION_FIELDS.find((f) => f.key === field)?.label} ${newValue ? "enabled" : "disabled"}`,
        true,
      );
    }
  }

  // ── Grant / revoke ALL permissions for one moderator ───────────────────
  async function handleGrantAll(moderator: ModeratorWithPermissions, grant: boolean) {
    const all = Object.fromEntries(
      PERMISSION_FIELDS.map(({ key }) => [key, grant]),
    ) as PermissionUpdate;

    setModerators((prev) =>
      prev.map((m) =>
        m.id === moderator.id
          ? { ...m, permissions: { ...m.permissions, ...all } }
          : m,
      ),
    );

    setSavingKey(moderator.id);
    const res = await setModeratorPermissionsAction(moderator.id, all);
    setSavingKey(null);

    if (res.error) {
      showToast(res.error, false);
      load();
    } else {
      showToast(
        `${moderator.name} — সব পারমিশন ${grant ? "দেওয়া হয়েছে" : "সরানো হয়েছে"}`,
        true,
      );
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Moderator Permissions
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            প্রতিটি মডারেটরের জন্য নির্দিষ্ট পারমিশন চালু / বন্ধ করুন
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow ${
            toast.ok
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.ok ? (
            <CheckCircle className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <RefreshCw className="mr-2 size-5 animate-spin" /> লোড হচ্ছে...
        </div>
      ) : moderators.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <ShieldCheck className="mx-auto mb-3 size-12 text-gray-300" />
          <p className="font-medium text-gray-500">কোনো মডারেটর নেই</p>
          <p className="mt-1 text-sm text-gray-400">
            Users পাতায় গিয়ে কাউকে Moderator রোল দিন, তারপর এখানে তাদের
            পারমিশন সেট করুন।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            {/* Column headers */}
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 min-w-[200px]">
                  Moderator
                </th>
                {PERMISSION_FIELDS.map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 min-w-[120px]"
                  >
                    {/* Split label at " — " for two-line display */}
                    <span className="block leading-tight">
                      {label.split(" — ")[0]}
                    </span>
                    <span className="block text-[10px] font-normal text-gray-400 leading-tight">
                      {label.split(" — ")[1]}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 min-w-[110px]">
                  Quick Set
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {moderators.map((mod) => {
                const allGranted = PERMISSION_FIELDS.every(
                  ({ key }) => mod.permissions[key],
                );
                const isSavingRow = savingKey === mod.id;

                return (
                  <tr key={mod.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Moderator info */}
                    <td className="sticky left-0 bg-white px-5 py-4 hover:bg-gray-50/70">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {mod.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {mod.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {mod.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Permission checkboxes */}
                    {PERMISSION_FIELDS.map(({ key }) => {
                      const cellKey = `${mod.id}:${key}`;
                      const isSaving = savingKey === cellKey || isSavingRow;
                      const isEnabled = mod.permissions[key];

                      return (
                        <td key={key} className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleToggle(mod, key)}
                            disabled={isSaving}
                            aria-label={`Toggle ${key} for ${mod.name}`}
                            aria-pressed={isEnabled}
                            className={`relative mx-auto flex size-7 items-center justify-center rounded-lg border-2 transition-all disabled:opacity-50 ${
                              isEnabled
                                ? "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
                                : "border-gray-200 bg-white text-transparent hover:border-red-300 hover:bg-red-50"
                            }`}
                          >
                            {isSaving ? (
                              <RefreshCw className="size-3.5 animate-spin text-gray-400" />
                            ) : (
                              <svg
                                className="size-3.5"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Quick set: grant all / revoke all */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => handleGrantAll(mod, true)}
                          disabled={allGranted || savingKey === mod.id}
                          className="w-full rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          সব চালু
                        </button>
                        <button
                          onClick={() => handleGrantAll(mod, false)}
                          disabled={!allGranted && PERMISSION_FIELDS.every(({ key }) => !mod.permissions[key]) || savingKey === mod.id}
                          className="w-full rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          সব বন্ধ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      {!loading && moderators.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          {moderators.length} জন মডারেটর · পারমিশন পরিবর্তন তাৎক্ষণিকভাবে সংরক্ষিত হয়
        </p>
      )}
    </div>
  );
}
