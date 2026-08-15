"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Pencil, Bookmark } from "lucide-react";
import { updateSubjectAction } from "@/features/subjects/actions/subjects.actions";
import type { Subject } from "@/db/schema";

interface SubjectEditModalProps {
  subject: Subject;
  onClose: () => void;
  onSaved: (title: string) => void;
  onError: (errorMsg: string) => void;
}

const editInitial: { error?: string; data?: undefined } = {};

export function SubjectEditModal({
  subject,
  onClose,
  onSaved,
  onError,
}: SubjectEditModalProps) {
  const boundUpdate = updateSubjectAction.bind(null, subject.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState(subject.title);

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else {
        onSaved(title);
        onClose();
      }
    }
  }, [submitted, isPending, state.error, onSaved, onError, onClose, title]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    const enteredTitle = fd.get("title")?.toString() || subject.title;
    setTitle(enteredTitle);
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
              <Pencil className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Subject</h3>
              <p className="text-xs text-gray-500">Update genre title and slug</p>
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
                Subject Title (বিষয়ের নাম) *
              </label>
              <input
                name="title"
                required
                defaultValue={subject.title}
                placeholder="e.g. উপন্যাস / Islamic Books"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                URL Slug (e.g. novel-fiction) *
              </label>
              <input
                name="slug"
                required
                pattern="[a-z0-9-]+"
                defaultValue={subject.slug}
                placeholder="lowercase letters, numbers, hyphens"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Sort Priority Order
              </label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={subject.sortOrder ?? "0"}
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={subject.isActive}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                />
                <span className="text-xs font-medium text-gray-700">
                  Active (Display publicly on category filters)
                </span>
              </label>
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
