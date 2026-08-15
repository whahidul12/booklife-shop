"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import type { ToastMessage } from "./types";

interface BannersToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function BannersToast({ toast, onClose }: BannersToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 items-center gap-3 rounded-xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-md">
      {isSuccess && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-5" />
        </div>
      )}
      {isError && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D10A13]/10 text-[#D10A13]">
          <AlertCircle className="size-5" />
        </div>
      )}
      {!isSuccess && !isError && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Info className="size-5" />
        </div>
      )}

      <div className="flex-1 pr-2">
        <p className="text-sm font-semibold text-gray-900">
          {isSuccess ? "Success" : isError ? "Error" : "Notification"}
        </p>
        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
