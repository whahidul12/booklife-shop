"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Plus, Building2 } from "lucide-react";
import { createPublisherAction } from "@/features/books/actions/taxonomy.actions";
import { CloudinaryImageUpload } from "../CloudinaryImageUpload";

interface PublisherCreateModalProps {
  onClose: () => void;
  onCreated: (name: string) => void;
  onError: (errorMsg: string) => void;
}

const createInitial: { error?: string; data?: { id: string } } = {};

export function PublisherCreateModal({
  onClose,
  onCreated,
  onError,
}: PublisherCreateModalProps) {
  const [state, formAction, isPending] = useActionState(createPublisherAction, createInitial);
  const [logoUrl, setLogoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [enteredName, setEnteredName] = useState("");

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else if (state.data) {
        onCreated(enteredName || "New Publisher");
        onClose();
      }
    }
  }, [submitted, isPending, state.error, state.data, onCreated, onError, onClose, enteredName]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    const name = fd.get("name")?.toString() || "";
    setEnteredName(name);
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <Building2 className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add Publisher</h3>
              <p className="text-xs text-gray-500">Create a new publishing house</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form action={handleAction}>
          <div className="p-6 space-y-4">
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#D10A13]">
                {state.error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Publisher Name (প্রকাশনীর নাম) *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. ইত্যাদি গ্রন্থ প্রকাশ / বাতিঘর"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <CloudinaryImageUpload
                folder="publishers"
                label="Publisher Logo"
                hiddenFieldName="logoUrl"
                currentUrl={logoUrl || null}
                onUpload={setLogoUrl}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D10A13] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Adding Publisher...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Create Publisher</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
