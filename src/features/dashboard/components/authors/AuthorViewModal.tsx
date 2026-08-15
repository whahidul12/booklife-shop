"use client";

import React from "react";
import Image from "next/image";
import { X, Feather, Pencil, Calendar, User, FileText } from "lucide-react";
import type { Author } from "@/db/schema";

interface AuthorViewModalProps {
  author: Author;
  onClose: () => void;
  onEdit: () => void;
}

export function AuthorViewModal({
  author,
  onClose,
  onEdit,
}: AuthorViewModalProps) {
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
              <Feather className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Author Details</h3>
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
          {/* Photo & Name Hero */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs flex items-center justify-center">
              {author.imageUrl ? (
                <Image
                  src={author.imageUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <User className="size-10 text-gray-300" />
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-lg font-bold text-gray-900">{author.name}</h2>
              <p className="font-mono text-xs text-gray-400">ID: {author.id}</p>
              <p className="text-[11px] text-gray-500">
                Added on: {new Date(author.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Biography */}
          {author.bio ? (
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                <FileText className="size-3.5" />
                <span>Biography</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {author.bio}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
              No biography details written for this author yet.
            </div>
          )}
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
            <span>Edit Author</span>
          </button>
        </div>
      </div>
    </div>
  );
}
