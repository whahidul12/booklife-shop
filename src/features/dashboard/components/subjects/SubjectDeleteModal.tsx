"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, RefreshCw } from "lucide-react";
import { deleteSubjectAction } from "@/features/subjects/actions/subjects.actions";
import type { Subject } from "@/db/schema";

interface SubjectDeleteModalProps {
  subject: Subject;
  onClose: () => void;
  onDeleted: (title: string) => void;
  onError: (errorMsg: string) => void;
}

export function SubjectDeleteModal({
  subject,
  onClose,
  onDeleted,
  onError,
}: SubjectDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await deleteSubjectAction(subject.id);
      if (res.error) {
        onError(res.error);
        setIsDeleting(false);
      } else {
        onDeleted(subject.title);
        onClose();
      }
    } catch {
      onError("Failed to delete subject");
      setIsDeleting(false);
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
          disabled={isDeleting}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#D10A13]">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Delete Subject</h3>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-6">
          Are you sure you want to permanently delete{" "}
          <strong className="text-gray-900 font-semibold">"{subject.title}"</strong>?
          Books referencing this subject will be updated accordingly.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D10A13] px-4.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
