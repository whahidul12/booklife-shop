"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import {
  getAllBannersAction,
  deleteBannerAction,
} from "@/features/banners/actions/banners.actions";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import type { Banner } from "@/db/schema";

// We call createBannerAction manually so we can include the cloudinary URL
// in the same submission — cannot use useActionState here because the image
// URL is set asynchronously by the upload component.

interface CreateBannerForm {
  type:       "hero" | "category";
  title:      string;
  imageUrl:   string;
  linkUrl:    string;
  sortOrder:  string;
}

const EMPTY_FORM: CreateBannerForm = {
  type:      "hero",
  title:     "",
  imageUrl:  "",
  linkUrl:   "",
  sortOrder: "0",
};

export function AdminBannersPage() {
  const [banners, setBanners]       = useState<Banner[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [form, setForm]             = useState<CreateBannerForm>(EMPTY_FORM);
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAllBannersAction();
    if (res.data) setBanners(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) {
      setCreateError("ব্যানারের ছবি আপলোড করুন");
      return;
    }
    setCreateError(null);
    setCreating(true);

    const { createBannerAction } = await import(
      "@/features/banners/actions/banners.actions"
    );
    const fd = new FormData();
    fd.set("type",      form.type);
    fd.set("title",     form.title);
    fd.set("imageUrl",  form.imageUrl);
    fd.set("linkUrl",   form.linkUrl);
    fd.set("sortOrder", form.sortOrder);
    fd.set("isActive",  "true");

    const res = await createBannerAction(undefined, fd);
    setCreating(false);

    if (res.error) {
      setCreateError(res.error);
    } else {
      setForm(EMPTY_FORM);
      load();
    }
  }

  async function handleDelete(id: string) {
    setDeleteError(null);
    const res = await deleteBannerAction(id);
    if (res.error) setDeleteError(res.error);
    else load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Banners</h1>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* ── Create form ─────────────────────────────────────────────────── */}
      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          নতুন ব্যানার যোগ করুন
        </h2>

        {createError && (
          <p className="mb-3 text-sm text-red-600">{createError}</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Type */}
          <select
            name="type"
            value={form.type}
            onChange={handleField}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          >
            <option value="hero">Hero Banner</option>
            <option value="category">Category Banner</option>
          </select>

          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={handleField}
            placeholder="ব্যানারের শিরোনাম"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />

          {/* Sort order */}
          <input
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={handleField}
            placeholder="Sort order (0)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />

          {/* Link URL */}
          <input
            name="linkUrl"
            value={form.linkUrl}
            onChange={handleField}
            placeholder="ক্লিক লিঙ্ক (URL)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 lg:col-span-2"
          />

          {/* Banner image upload */}
          <div className="lg:col-span-3">
            <CloudinaryImageUpload
              folder="banners"
              label="ব্যানার ছবি *"
              hiddenFieldName="imageUrl"
              currentUrl={form.imageUrl || null}
              onUpload={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating || !form.imageUrl}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {creating ? "যোগ হচ্ছে..." : "যোগ করুন"}
        </button>
      </form>

      {deleteError && (
        <p className="mb-3 text-sm text-red-600">{deleteError}</p>
      )}

      {/* ── Banner grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 py-8 text-center text-gray-400">
            লোড হচ্ছে...
          </p>
        ) : banners.length === 0 ? (
          <p className="col-span-3 py-8 text-center text-gray-400">
            কোনো ব্যানার নেই
          </p>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Preview */}
              <div className="relative aspect-[3/1] w-full overflow-hidden bg-gray-100">
                <Image
                  src={b.imageUrl}
                  alt={b.title ?? "banner"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Info + actions */}
              <div className="flex items-start justify-between p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {b.title ?? "—"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs uppercase text-gray-400">
                      {b.type}
                    </span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">
                      order {b.sortOrder}
                    </span>
                    <span
                      className={`ml-1 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        b.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
