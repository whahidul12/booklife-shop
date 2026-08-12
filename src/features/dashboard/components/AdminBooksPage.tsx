"use client";

import { useEffect, useActionState, useState } from "react";
import { Trash2, Plus, RefreshCw, X, Pencil } from "lucide-react";
import {
  getBooksAction,
  createBookAction,
  deleteBookAction,
  updateBookAction,
} from "@/features/books/actions/books.actions";
import {
  getAuthorsAction,
  getPublishersAction,
} from "@/features/books/actions/taxonomy.actions";
import { getActiveSubjectsAction } from "@/features/subjects/actions/subjects.actions";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import type { Book, Author, Publisher, Subject } from "@/db/schema";

// ── Types ──────────────────────────────────────────────────────────────────

type SubjectRow = Pick<Subject, "id" | "title" | "slug">;

// ── Edit Modal ─────────────────────────────────────────────────────────────

interface EditBookModalProps {
  book:       Book;
  authors:    Author[];
  publishers: Publisher[];
  subjects:   SubjectRow[];
  onClose:    () => void;
  onSaved:    () => void;
}

const editInitial: { error?: string; data?: undefined } = {};

function EditBookModal({
  book,
  authors,
  publishers,
  subjects,
  onClose,
  onSaved,
}: EditBookModalProps) {
  // bind the book id into the first positional arg of updateBookAction
  const boundUpdate = updateBookAction.bind(null, book.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);
  const [coverUrl, setCoverUrl] = useState(book.imageUrl ?? "");

  // Track whether we have submitted at least once so we can detect success
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !isPending && !state.error) {
      onSaved();
      onClose();
    }
  }, [submitted, isPending, state.error, onSaved, onClose]);

  function handleAction(fd: FormData) {
    setSubmitted(true);
    return formAction(fd);
  }

  const currentPrice    = book.pricePaisa         ? (book.pricePaisa / 100).toFixed(2)         : "";
  const currentDiscount = book.discountPricePaisa  ? (book.discountPricePaisa / 100).toFixed(2) : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="বন্ধ করুন"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-5 text-base font-bold text-gray-900">বই সম্পাদনা করুন</h3>

        {state.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={handleAction} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              বইয়ের নাম *
            </label>
            <input
              name="name"
              required
              defaultValue={book.name}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              বিবরণ
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={book.description ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Price / Discount price / Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                মূল্য (৳) *
              </label>
              <input
                name="price"
                type="number"
                required
                step="0.01"
                min="0"
                defaultValue={currentPrice}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                ছাড়ের মূল্য (৳)
              </label>
              <input
                name="discountPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={currentDiscount}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                স্টক
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={book.stock}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Edition / Pages / Format */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                সংস্করণ
              </label>
              <input
                name="edition"
                defaultValue={book.edition ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                পৃষ্ঠা সংখ্যা
              </label>
              <input
                name="totalPages"
                type="number"
                min="1"
                defaultValue={book.totalPages ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                ফরম্যাট
              </label>
              <select
                name="format"
                defaultValue={book.format ?? "paperback"}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              >
                <option value="paperback">Paperback</option>
                <option value="hardcover">Hardcover</option>
                <option value="ebook">eBook</option>
              </select>
            </div>
          </div>

          {/* Author / Publisher / Subject */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                লেখক
              </label>
              <select
                name="authorId"
                defaultValue={book.authorId ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              >
                <option value="">-- লেখক --</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                প্রকাশনী
              </label>
              <select
                name="publisherId"
                defaultValue={book.publisherId ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              >
                <option value="">-- প্রকাশনী --</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                বিষয়
              </label>
              <select
                name="subjectId"
                defaultValue={book.subjectId ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              >
                <option value="">-- বিষয় --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex gap-5 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={book.isFeatured}
                className="accent-red-600"
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPreorder"
                value="true"
                defaultChecked={book.isPreorder}
                className="accent-red-600"
              />
              Pre-order
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={book.isActive}
                className="accent-red-600"
              />
              Active
            </label>
          </div>

          {/* Cover image */}
          <CloudinaryImageUpload
            folder="books"
            label="কভার ছবি"
            hiddenFieldName="imageUrl"
            currentUrl={coverUrl || null}
            onUpload={setCoverUrl}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? (
                <><RefreshCw className="size-4 animate-spin" /> সংরক্ষণ হচ্ছে...</>
              ) : (
                "পরিবর্তন সংরক্ষণ করুন"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

const createInitial: { error?: string; data?: { id: string } } = {};

export function AdminBooksPage() {
  const [books, setBooks]           = useState<Book[]>([]);
  const [authors, setAuthors]       = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [subjects, setSubjects]     = useState<SubjectRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl]     = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [createState, createAction, isPending] = useActionState(
    createBookAction,
    createInitial,
  );

  async function load() {
    setLoading(true);
    const [bRes, aRes, pRes, sRes] = await Promise.all([
      getBooksAction({ limit: 100 }),
      getAuthorsAction(),
      getPublishersAction(),
      getActiveSubjectsAction(),
    ]);
    if (bRes.data) setBooks(bRes.data);
    if (aRes.data) setAuthors(aRes.data);
    if (pRes.data) setPublishers(pRes.data);
    if (sRes.data) setSubjects(sRes.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (createState.data) {
      setCoverUrl("");
      load();
    }
  }, [createState.data]);

  async function handleDelete(id: string) {
    if (!confirm("এই বইটি মুছে ফেলবেন?")) return;
    setDeleteError(null);
    const res = await deleteBookAction(id);
    if (res.error) setDeleteError(res.error);
    else load();
  }

  return (
    <div>
      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          authors={authors}
          publishers={publishers}
          subjects={subjects}
          onClose={() => setEditingBook(null)}
          onSaved={() => { setEditingBook(null); load(); }}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Books</h1>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* ── Create form ─────────────────────────────────────────────────── */}
      <form
        action={createAction}
        className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          নতুন বই যোগ করুন
        </h2>

        {createState.error && (
          <p className="mb-3 text-sm text-red-600">{createState.error}</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            name="name"
            required
            placeholder="বইয়ের নাম (বাংলা) *"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 lg:col-span-2"
          />
          <input
            name="price"
            type="number"
            required
            step="0.01"
            min="0"
            placeholder="মূল্য (৳) *"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          <input
            name="discountPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="ছাড়ের মূল্য (৳)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="স্টক"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          <input
            name="edition"
            placeholder="সংস্করণ"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          <input
            name="totalPages"
            type="number"
            min="1"
            placeholder="পৃষ্ঠা সংখ্যা"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          <select
            name="authorId"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          >
            <option value="">-- লেখক --</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select
            name="publisherId"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          >
            <option value="">-- প্রকাশনী --</option>
            {publishers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            name="subjectId"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          >
            <option value="">-- বিষয় --</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <select
            name="format"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          >
            <option value="paperback">Paperback</option>
            <option value="hardcover">Hardcover</option>
            <option value="ebook">eBook</option>
          </select>
          <div className="lg:col-span-3">
            <CloudinaryImageUpload
              folder="books"
              label="বইয়ের কভার ছবি"
              hiddenFieldName="imageUrl"
              currentUrl={coverUrl || null}
              onUpload={setCoverUrl}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-5 text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" value="true" className="accent-red-600" />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPreorder" value="true" className="accent-red-600" />
            Pre-order
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {isPending ? "যোগ হচ্ছে..." : "বই যোগ করুন"}
        </button>
      </form>

      {deleteError && (
        <p className="mb-3 text-sm text-red-600">{deleteError}</p>
      )}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Price (৳)</th>
              <th className="px-4 py-3 text-left font-medium">Discount (৳)</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  কোনো বই নেই
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900">
                    {b.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(b.pricePaisa / 100).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.discountPricePaisa
                      ? (b.discountPricePaisa / 100).toFixed(0)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingBook(b)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
