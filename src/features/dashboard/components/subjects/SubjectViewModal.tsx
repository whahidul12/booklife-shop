"use client";

import React from "react";
import { X, Bookmark, Pencil, Calendar, CheckCircle2, XCircle, ArrowUpDown, Tag } from "lucide-react";
import type { Subject } from "@/db/schema";

interface SubjectViewModalProps {
  subject: Subject;
  onClose: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
}

export function SubjectViewModal({
  subject,
  onClose,
  onEdit,
  onToggleActive,
}: SubjectViewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#D10A13]">
              <Bookmark className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Subject Details</h3>
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
          {/* Title & Slug Hero */}
          <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-gray-400">ID: {subject.id}</span>
              {subject.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="size-3" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                  <XCircle className="size-3" /> Inactive
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{subject.title}</h2>
            <div className="flex items-center gap-1.5 font-mono text-xs text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 w-fit">
              <Tag className="size-3 text-gray-400" />
              <span>/{subject.slug}</span>
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Sort Priority Order</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {subject.sortOrder ?? "0"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Created Date</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {new Date(subject.createdAt).toLocaleDateString()}
              </p>
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
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all"
          >
            <Pencil className="size-3.5" />
            <span>Edit Subject</span>
          </button>
        </div>
      </div>
    </div>
  );
}
