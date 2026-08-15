"use client";

import React from "react";
import Image from "next/image";
import { X, Presentation, Pencil, Calendar, CheckCircle2, XCircle, ExternalLink, Smartphone } from "lucide-react";
import type { Banner } from "@/db/schema";

interface BannerViewModalProps {
  banner: Banner;
  onClose: () => void;
  onEdit: () => void;
}

export function BannerViewModal({
  banner,
  onClose,
  onEdit,
}: BannerViewModalProps) {
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
              <Presentation className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">Banner Preview</h3>
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
          {/* Main Desktop Image Preview */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-700">Desktop Display</p>
            <div className="relative aspect-21/9 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Banner Preview"}
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 500px"
              />
            </div>
          </div>

          {/* Mobile Image (if available) */}
          {banner.mobileImageUrl && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <Smartphone className="size-3.5 text-gray-400" />
                <span>Mobile Display Version</span>
              </div>
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                <Image
                  src={banner.mobileImageUrl}
                  alt={banner.title || "Mobile Banner Preview"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 600px) 100vw, 500px"
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-gray-400">ID: {banner.id}</span>
              {banner.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="size-3" /> Live & Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                  <XCircle className="size-3" /> Inactive
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-gray-900">
              {banner.title || <span className="italic text-gray-400">Untitled Banner</span>}
            </h2>
            {banner.linkUrl && (
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#D10A13] hover:underline"
              >
                <ExternalLink className="size-3.5" />
                <span className="truncate max-w-xs">{banner.linkUrl}</span>
              </a>
            )}
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Banner Type</p>
              <p className="text-xs font-semibold text-gray-900 mt-1 capitalize">
                {banner.type === "hero" ? "Hero Carousel" : "Category Banner"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Sort Sequence</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                Order #{banner.sortOrder ?? 0}
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
            <span>Edit Banner</span>
          </button>
        </div>
      </div>
    </div>
  );
}
