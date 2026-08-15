"use client";

import React from "react";
import Image from "next/image";
import { X, Building2, Pencil, Calendar, Image as ImageIcon } from "lucide-react";
import type { Publisher } from "@/db/schema";

interface PublisherViewModalProps {
  publisher: Publisher;
  onClose: () => void;
  onEdit: () => void;
}

export function PublisherViewModal({
  publisher,
  onClose,
  onEdit,
}: PublisherViewModalProps) {
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
              <Building2 className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Publisher Details</h3>
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
          {/* Logo & Name Hero */}
          <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs flex items-center justify-center mb-3">
              {publisher.logoUrl ? (
                <Image
                  src={publisher.logoUrl}
                  alt={publisher.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : (
                <Building2 className="size-8 text-gray-300" />
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{publisher.name}</h2>
            <p className="font-mono text-xs text-gray-400 mt-0.5">ID: {publisher.id}</p>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Logo Status</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {publisher.logoUrl ? "Branded Logo Available" : "No Logo Uploaded"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Created Date</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                {new Date(publisher.createdAt).toLocaleDateString()}
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
            <span>Edit Publisher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
