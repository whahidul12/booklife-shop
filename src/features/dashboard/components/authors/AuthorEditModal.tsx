"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Pencil, Feather } from "lucide-react";
import { updateAuthorAction } from "@/features/books/actions/taxonomy.actions";
import { CloudinaryImageUpload } from "../CloudinaryImageUpload";
import type { Author } from "@/db/schema";

interface AuthorEditModalProps {
  author: Author;
  onClose: () => void;
  onSaved: (name: string) => void;
  onError: (errorMsg: string) => void;
}

const editInitial: { error?: string; data?: undefined } = {};

export function AuthorEditModal({
  author,
  onClose,
  onSaved,
  onError,
}: AuthorEditModalProps) {
  const boundUpdate = updateAuthorAction.bind(null, author.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);
  const [imageUrl, setImageUrl] = useState(author.imageUrl ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(author.name);

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else {
        onSaved(name);
        onClose();
      }
    }
  }, [submitted, isPending, state.error, onSaved, onError, onClose, name]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    const enteredName = fd.get("name")?.toString() || author.name;
    setName(enteredName);
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <Pencil className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Author</h3>
              <p className="text-xs text-gray-500">Update author biography and photo</p>
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
                Author Name (লেখকের নাম) *
              </label>
              <input
                name="name"
                required
                defaultValue={author.name}
                placeholder="e.g. হুমায়ূন আহমেদ / Rabindranath Tagore"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Short Biography (সংক্ষিপ্ত পরিচিতি)
              </label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={author.bio ?? ""}
                placeholder="Brief bio or achievements of the author..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <CloudinaryImageUpload
                folder="authors"
                label="Author Portrait Photo"
                hiddenFieldName="imageUrl"
                currentUrl={imageUrl || null}
                onUpload={setImageUrl}
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
