"use client";

import React from "react";
import Image from "next/image";
import { X, ShieldCheck, CheckCircle2, XCircle, Mail, Calendar, User } from "lucide-react";
import type { ModeratorWithPermissions } from "@/features/permissions/actions/permissions.actions";
import { PERMISSION_FIELDS } from "@/db/schema/moderator-permissions.schema";

interface ModeratorViewModalProps {
  moderator: ModeratorWithPermissions;
  onClose: () => void;
}

export function ModeratorViewModal({
  moderator,
  onClose,
}: ModeratorViewModalProps) {
  const activeCount = Object.values(moderator.permissions).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#D10A13]">
              <ShieldCheck className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Moderator Access Breakdown</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Moderator Bio Header */}
          <div className="flex items-center gap-3.5 p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-red-50 text-[#D10A13] font-bold flex items-center justify-center text-sm shadow-2xs">
              {moderator.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{moderator.name}</h2>
              <p className="text-xs text-gray-500 font-mono">{moderator.email}</p>
            </div>
            <div className="ml-auto text-right">
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-[#D10A13]">
                {activeCount} of {PERMISSION_FIELDS.length} Scopes
              </span>
            </div>
          </div>

          {/* Detailed Permissions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Module Access Privileges
            </h4>
            <div className="rounded-xl border border-gray-200/80 divide-y divide-gray-100 overflow-hidden">
              {PERMISSION_FIELDS.map((field) => {
                const isGranted = moderator.permissions[field.key];

                return (
                  <div
                    key={field.key}
                    className="flex items-center justify-between p-3 text-xs"
                  >
                    <span className="font-medium text-gray-700">{field.label}</span>
                    {isGranted ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4 text-emerald-600" /> Granted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-400">
                        <XCircle className="size-4 text-gray-300" /> Restricted
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
