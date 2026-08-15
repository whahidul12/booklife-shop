"use client";

import React, { useEffect, useActionState, useState } from "react";
import { X, RefreshCw, Plus, BookPlus } from "lucide-react";
import { createBookAction } from "@/features/books/actions/books.actions";
import { CloudinaryImageUpload } from "../CloudinaryImageUpload";
import type { Author, Publisher } from "@/db/schema";
import type { SubjectRow } from "./types";

interface BookCreateModalProps {
  authors: Author[];
  publishers: Publisher[];
  subjects: SubjectRow[];
  onClose: () => void;
  onCreated: (bookName: string) => void;
  onError: (errorMsg: string) => void;
}

const createInitial: { error?: string; data?: { id: string } } = {};

export function BookCreateModal({
  authors,
  publishers,
  subjects,
  onClose,
  onCreated,
  onError,
}: BookCreateModalProps) {
  const [state, formAction, isPending] = useActionState(createBookAction, createInitial);
  const [coverUrl, setCoverUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [enteredName, setEnteredName] = useState("");

  useEffect(() => {
    if (submitted && !isPending) {
      if (state.error) {
        onError(state.error);
        setSubmitted(false);
      } else if (state.data) {
        onCreated(enteredName || "New book");
        onClose();
      }
    }
  }, [submitted, isPending, state.error, state.data, onCreated, onError, onClose, enteredName]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    setEnteredName(fd.get("name")?.toString() || "");
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-[#D10A13]">
              <BookPlus className="size-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add New Product</h3>
              <p className="text-xs text-gray-500">
                Create a new book entry in the store catalog
              </p>
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
          <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#D10A13]">
                {state.error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                General Information
              </h4>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Book Title (বইয়ের নাম) *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. চাঁদের পাহাড় / The Art of Computer Programming"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Description (বিবরণ)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief synopsis or summary of the book..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pricing & Inventory
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Regular Price (৳) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    placeholder="450"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Discount Price (৳)
                  </label>
                  <input
                    name="discountPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="380 (optional)"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Initial Stock *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={10}
                    placeholder="10"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  />
                </div>
              </div>
            </div>

            {/* Taxonomy / Classification */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Taxonomy & Relations
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Author (লেখক)
                  </label>
                  <select
                    name="authorId"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  >
                    <option value="">-- Select Author --</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Publisher (প্রকাশনী)
                  </label>
                  <select
                    name="publisherId"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  >
                    <option value="">-- Select Publisher --</option>
                    {publishers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Subject / Category (বিষয়)
                  </label>
                  <select
                    name="subjectId"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Specifications
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Format
                  </label>
                  <select
                    name="format"
                    defaultValue="paperback"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  >
                    <option value="paperback">Paperback</option>
                    <option value="hardcover">Hardcover</option>
                    <option value="ebook">eBook</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Edition
                  </label>
                  <input
                    name="edition"
                    placeholder="1st Edition, 2024"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Total Pages
                  </label>
                  <input
                    name="totalPages"
                    type="number"
                    min="1"
                    placeholder="250"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#D10A13] focus:ring-2 focus:ring-[#D10A13]/20"
                  />
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Visibility & Attributes
              </h4>

              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={true}
                    className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                  />
                  <span>Active (Published immediately)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="true"
                    className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPreorder"
                    value="true"
                    className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13]"
                  />
                  <span>Pre-order Item</span>
                </label>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="pt-2 border-t border-gray-100">
              <CloudinaryImageUpload
                folder="books"
                label="Book Cover Image"
                hiddenFieldName="imageUrl"
                currentUrl={coverUrl || null}
                onUpload={setCoverUrl}
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
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
