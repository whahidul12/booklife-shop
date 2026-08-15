"use client";

import React from "react";
import Image from "next/image";
import { Presentation, CheckCircle2, XCircle, ExternalLink, Smartphone } from "lucide-react";
import type { Banner } from "@/db/schema";
import { BannerActionMenu } from "./BannerActionMenu";

interface BannersTableProps {
  banners: Banner[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewBanner: (banner: Banner) => void;
  onEditBanner: (banner: Banner) => void;
  onToggleActiveBanner: (banner: Banner) => void;
  onDeleteBanner: (banner: Banner) => void;
}

export function BannersTable({
  banners,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewBanner,
  onEditBanner,
  onToggleActiveBanner,
  onDeleteBanner,
}: BannersTableProps) {
  const allSelected = banners.length > 0 && selectedIds.length === banners.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < banners.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-semibold text-gray-600">Banner Artwork</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Title & Link</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Type</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Sort Priority</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-14 w-28 rounded-xl bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-36 rounded bg-gray-200 mb-1.5" />
                    <div className="h-3 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-10 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Presentation className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No banners found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query or type filters.
                  </p>
                </td>
              </tr>
            ) : (
              banners.map((banner) => {
                const isSelected = selectedIds.includes(banner.id);

                return (
                  <tr
                    key={banner.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(banner.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Banner Thumbnail */}
                    <td className="px-4 py-3.5">
                      <div
                        onClick={() => onViewBanner(banner)}
                        className="relative h-14 w-28 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-2xs transition-transform hover:scale-105"
                      >
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title || "Banner"}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    </td>

                    {/* Title & Link */}
                    <td className="px-4 py-3.5 max-w-[260px]">
                      <div className="space-y-1">
                        <span
                          onClick={() => onViewBanner(banner)}
                          className="font-semibold text-xs text-gray-900 hover:text-[#D10A13] cursor-pointer transition-colors block truncate"
                        >
                          {banner.title || <span className="italic text-gray-400">Untitled Banner</span>}
                        </span>
                        {banner.linkUrl ? (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-gray-400 truncate">
                            <ExternalLink className="size-3 shrink-0" />
                            <span className="truncate">{banner.linkUrl}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-300 italic">No link attached</span>
                        )}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3.5">
                      {banner.type === "hero" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-100">
                          Hero Carousel
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
                          Category Banner
                        </span>
                      )}
                    </td>

                    {/* Sort Order */}
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      #{banner.sortOrder ?? 0}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {banner.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="size-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                          <XCircle className="size-3" /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <BannerActionMenu
                        banner={banner}
                        onView={onViewBanner}
                        onEdit={onEditBanner}
                        onToggleActive={onToggleActiveBanner}
                        onDelete={onDeleteBanner}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
