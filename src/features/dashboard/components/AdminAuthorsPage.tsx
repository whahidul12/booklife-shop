"use client";

import { useEffect, useActionState, useState } from "react";
import { Trash2, Plus, RefreshCw, X, Pencil } from "lucide-react";
import {
  getAuthorsAction,
  createAuthorAction,
  deleteAuthorAction,
  updateAuthorAction,
} from "@/features/books/actions/taxonomy.actions";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import type { Author } from "@/db/schema";

// ── Edit Modal ─────────────────────────────────────────────────────────────

interface EditAuthorModalProps {
  author: Author;
  onClose: () => void;
  onSaved: () => void;
}

const editInitial: { error?: string; data?: undefined } = {};

function EditAuthorModal({ author, onClose, onSaved }: EditAuthorModalProps) {
  const boundUpdate = updateAuthorAction.bind(null, author.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);
  const [imageUrl, setImageUrl] = useState(author.imageUrl ?? "");
  const [submitted, setSubmitted] = useState(false);

  // Detect success: action ran (isPending went false) and no error
  useEffect(() => {
    if (submitted && !isPending && !state.error) {
      onSaved();
      onClose();
    }
  }, [submitted, isPending, state.error, onSaved, onClose]);

  function handleSubmit(fd: FormData) {
    setSubmitted(true);
    return formAction(fd);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-5 text-base font-bold text-gray-900">
          লেখক সম্পাদনা করুন
        </h3>

        {state.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              লেখকের নাম *
            </label>
            <input
              name="name"
              required
              defaultValue={author.name}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              সংক্ষিপ্ত পরিচিতি
            </label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={author.bio ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          <div>
            <CloudinaryImageUpload
              folder="authors"
              label="লেখকের ছবি"
              hiddenFieldName="imageUrl"
              currentUrl={imageUrl || null}
              onUpload={setImageUrl}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? (
                <><RefreshCw className="size-4 animate-spin" /> সংরক্ষণ হচ্ছে...</>
              ) : (
                "সংরক্ষণ করুন"
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

export function AdminAuthorsPage() {
  const [rows, setRows]         = useState<Author[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const [createState, createAction, isPending] = useActionState(
    createAuthorAction,
    createInitial,
  );

  async function load() {
    setLoading(true);
    const res = await getAuthorsAction();
    if (res.data) setRows(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (createState.data) {
      setImageUrl("");
      load();
    }
  }, [createState.data]);

  async function handleDelete(id: string) {
    if (!confirm("এই লেখককে মুছে ফেলবেন?")) return;
    setDeleteError(null);
    const res = await deleteAuthorAction(id);
    if (res.error) setDeleteError(res.error);
    else load();
  }

  return (
    <div>
      {editingAuthor && (
        <EditAuthorModal
          author={editingAuthor}
          onClose={() => setEditingAuthor(null)}
          onSaved={() => { setEditingAuthor(null); load(); }}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Authors</h1>
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
          নতুন লেখক যোগ করুন
        </h2>

        {createState.error && (
          <p className="mb-3 text-sm text-red-600">{createState.error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              লেখকের নাম (বাংলা) *
            </label>
            <input
              name="name"
              required
              placeholder="যেমন: আরিফ আজাদ"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              সংক্ষিপ্ত পরিচিতি
            </label>
            <textarea
              name="bio"
              rows={2}
              placeholder="লেখক সম্পর্কে সংক্ষিপ্ত তথ্য"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          <div className="sm:col-span-2">
            <CloudinaryImageUpload
              folder="authors"
              label="লেখকের ছবি"
              hiddenFieldName="imageUrl"
              currentUrl={imageUrl || null}
              onUpload={setImageUrl}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {isPending ? "যোগ হচ্ছে..." : "যোগ করুন"}
        </button>
      </form>

      {deleteError && (
        <p className="mb-3 text-sm text-red-600">{deleteError}</p>
      )}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Bio</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">লোড হচ্ছে...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">কোনো লেখক নেই</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-gray-500 sm:table-cell">
                    {r.bio ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingAuthor(r)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
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
