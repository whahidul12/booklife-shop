"use client";

import React, { useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, X, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { UserRow } from "./types";

interface UserBanModalProps {
  user: UserRow;
  onClose: () => void;
  onSuccess: (isBanned: boolean) => void;
  onError: (errorMsg: string) => void;
}

export function UserBanModal({
  user,
  onClose,
  onSuccess,
  onError,
}: UserBanModalProps) {
  const [isPending, setIsPending] = useState(false);
  const isCurrentlyBanned = !!user.banned;

  async function handleToggle() {
    setIsPending(true);
    try {
      if (isCurrentlyBanned) {
        const res = await authClient.admin.unbanUser({ userId: user.id });
        if (res.error) {
          onError(res.error.message || "Failed to unban user");
          setIsPending(false);
        } else {
          onSuccess(false);
          onClose();
        }
      } else {
        const res = await authClient.admin.banUser({
          userId: user.id,
          banReason: "Administrative action",
        });
        if (res.error) {
          onError(res.error.message || "Failed to ban user");
          setIsPending(false);
        } else {
          onSuccess(true);
          onClose();
        }
      }
    } catch {
      onError("Failed to perform action");
      setIsPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
              isCurrentlyBanned ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-[#D10A13]"
            }`}
          >
            {isCurrentlyBanned ? <CheckCircle2 className="size-6" /> : <Ban className="size-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isCurrentlyBanned ? "Unban Account" : "Ban User Account"}
            </h3>
            <p className="text-xs text-gray-500">
              {isCurrentlyBanned ? "Restore access to this customer" : "Restrict access from storefront"}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-6">
          {isCurrentlyBanned ? (
            <>
              Are you sure you want to unban{" "}
              <strong className="text-gray-900 font-semibold">{user.name}</strong> ({user.email})?
              They will be allowed to sign in and place orders again.
            </>
          ) : (
            <>
              Are you sure you want to ban{" "}
              <strong className="text-gray-900 font-semibold">{user.name}</strong> ({user.email})?
              The user will be immediately logged out and forbidden from signing in.
            </>
          )}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all disabled:opacity-60 ${
              isCurrentlyBanned
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#D10A13] hover:bg-[#b5080f]"
            }`}
          >
            {isPending ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isCurrentlyBanned ? (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Unban Account</span>
              </>
            ) : (
              <>
                <Ban className="size-3.5" />
                <span>Ban Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
