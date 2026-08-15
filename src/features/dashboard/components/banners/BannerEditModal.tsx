"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Pencil, Presentation } from "lucide-react";
import { updateBannerAction } from "@/features/banners/actions/banners.actions";
import { CloudinaryImageUpload } from "../CloudinaryImageUpload";
import type { Banner } from "@/db/schema";

interface BannerEditModalProps {
  banner: Banner;
  onClose: () => void;
  onSaved: (title: string) => void;
  onError: (errorMsg: string) => void;
}

const editInitial: { error?: string; data?: undefined } = {};

export function BannerEditModal({
  banner,
  onClose,
  onSaved,
  onError,
}: BannerEditModalProps) {
  const boundUpdate = updateBannerAction.bind(null, banner.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);

  const [imageUrl, setImageUrl] = useState(banner.imageUrl);
  const [mobileImageUrl, setMobileImageUrl] = useState(banner.mobileImageUrl ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState(banner.title ?? "Banner");

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
    if (!imageUrl) {
      onError("Please upload a banner image");
      return;
    }
    setSubmitted(true);
    const enteredTitle = fd.get("title")?.toString() || "Banner";
    setTitle(enteredTitle);
    fd.set("imageUrl", imageUrl);
    fd.set("mobileImageUrl", mobileImageUrl);
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <Pencil className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Banner</h3>
              <p className="text-xs text-gray-500">Update promotional banner details</p>
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
        <form action={handleAction} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#D10A13]">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Banner Type *
                </label>
                <select
                  name="type"
                  defaultValue={banner.type}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                >
                  <option value="hero">Hero Carousel (হিরো ব্যানার)</option>
                  <option value="category">Category Banner (ক্যাটাগরি ব্যানার)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Sort Priority Sequence
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={banner.sortOrder ?? 0}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Banner Title (ব্যানারের শিরোনাম)
              </label>
              <input
                name="title"
                defaultValue={banner.title ?? ""}
                placeholder="e.g. অমর একুশে বইমেলা বিশেষ ছাড়"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Target Link URL (ক্লিক করলে যেখানে যাবে)
              </label>
              <input
                name="linkUrl"
                type="url"
                defaultValue={banner.linkUrl ?? ""}
                placeholder="https://example.com/books/special or /books/general"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
              />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-4">
              <CloudinaryImageUpload
                folder="banners"
                label="Desktop Banner Image (1200x500)"
                hiddenFieldName="imageUrl"
                currentUrl={imageUrl || null}
                onUpload={setImageUrl}
              />

              <CloudinaryImageUpload
                folder="banners"
                label="Mobile Banner Image (Optional, 600x400)"
                hiddenFieldName="mobileImageUrl"
                currentUrl={mobileImageUrl || null}
                onUpload={setMobileImageUrl}
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={banner.isActive}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                />
                <span className="text-xs font-medium text-gray-700">
                  Active (Display immediately on website)
                </span>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-4 shrink-0">
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
