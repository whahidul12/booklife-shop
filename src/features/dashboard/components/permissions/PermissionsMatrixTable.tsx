"use client";

import React from "react";
import Image from "next/image";
import { Shield, ShieldCheck, RefreshCw, User, Check, X } from "lucide-react";
import type { ModeratorWithPermissions } from "@/features/permissions/actions/permissions.actions";
import { PERMISSION_FIELDS } from "@/db/schema/moderator-permissions.schema";
import type { PermKey } from "./types";
import { ModeratorActionMenu } from "./ModeratorActionMenu";

interface PermissionsMatrixTableProps {
  moderators: ModeratorWithPermissions[];
  loading: boolean;
  savingKey: string | null;
  onToggle: (moderator: ModeratorWithPermissions, field: PermKey) => void;
  onGrantAll: (moderator: ModeratorWithPermissions) => void;
  onRevokeAll: (moderator: ModeratorWithPermissions) => void;
  onView: (moderator: ModeratorWithPermissions) => void;
}

const SHORT_LABELS: Record<string, string> = {
  canManageBooks: "Books",
  canModerateReviews: "Reviews",
  canManageAuthors: "Authors",
  canManagePublishers: "Publishers",
  canManageCoupons: "Coupons",
  canManageHeroBanners: "Hero Bnr",
  canManageCategoryBanners: "Cat Bnr",
};

export function PermissionsMatrixTable({
  moderators,
  loading,
  savingKey,
  onToggle,
  onGrantAll,
  onRevokeAll,
  onView,
}: PermissionsMatrixTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="px-4 py-4 font-semibold text-gray-600 w-64">Moderator</th>
              {PERMISSION_FIELDS.map((f) => (
                <th
                  key={f.key}
                  className="px-3 py-4 text-center font-semibold text-gray-600"
                  title={f.label}
                >
                  <div className="flex flex-col items-center">
                    <span>{SHORT_LABELS[f.key] || f.key}</span>
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Quick Actions</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gray-200" />
                      <div className="space-y-1">
                        <div className="h-3.5 w-24 rounded bg-gray-200" />
                        <div className="h-3 w-32 rounded bg-gray-200" />
                      </div>
                    </div>
                  </td>
                  {PERMISSION_FIELDS.map((f) => (
                    <td key={f.key} className="px-3 py-4 text-center">
                      <div className="mx-auto size-5 rounded bg-gray-200" />
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto h-6 w-20 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : moderators.length === 0 ? (
              <tr>
                <td colSpan={PERMISSION_FIELDS.length + 3} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Shield className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No staff moderators found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Users with the "moderator" role will appear in this permission matrix automatically.
                  </p>
                </td>
              </tr>
            ) : (
              moderators.map((mod) => {
                const grantedCount = Object.values(mod.permissions).filter(Boolean).length;
                const allGranted = grantedCount === PERMISSION_FIELDS.length;
                const noneGranted = grantedCount === 0;

                return (
                  <tr key={mod.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* User Profile */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onView(mod)}
                          className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-red-50 text-[#D10A13] font-bold flex items-center justify-center text-xs shadow-2xs transition-transform hover:scale-105"
                        >
                          {mod.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span
                            onClick={() => onView(mod)}
                            className="font-semibold text-xs text-gray-900 hover:text-[#D10A13] cursor-pointer transition-colors block truncate"
                          >
                            {mod.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono block truncate">
                            {mod.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Permissions Checkbox Matrix */}
                    {PERMISSION_FIELDS.map((f) => {
                      const isGranted = mod.permissions[f.key];
                      const isSaving = savingKey === `${mod.id}:${f.key}`;

                      return (
                        <td key={f.key} className="px-3 py-3.5 text-center">
                          <label className="relative inline-flex items-center justify-center cursor-pointer select-none">
                            {isSaving ? (
                              <RefreshCw className="size-4 animate-spin text-[#D10A13]" />
                            ) : (
                              <input
                                type="checkbox"
                                checked={isGranted}
                                onChange={() => onToggle(mod, f.key)}
                                className="size-4.5 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer transition-all"
                              />
                            )}
                          </label>
                        </td>
                      );
                    })}

                    {/* Quick All / None Actions */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onGrantAll(mod)}
                          disabled={allGranted}
                          className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => onRevokeAll(mod)}
                          disabled={noneGranted}
                          className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-semibold text-[#D10A13] hover:bg-red-100 disabled:opacity-40 transition-colors"
                        >
                          Revoke
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <ModeratorActionMenu
                        moderator={mod}
                        onView={onView}
                        onGrantAll={onGrantAll}
                        onRevokeAll={onRevokeAll}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
