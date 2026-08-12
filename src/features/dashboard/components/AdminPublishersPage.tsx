"use client";

import { useEffect, useActionState, useState } from "react";
import { Trash2, Plus, RefreshCw, X, Pencil } from "lucide-react";
import {
  getPublishersAction,
  createPublisherAction,
  deletePublisherAction,
  updatePublisherAction,
} from "@/features/books/actions/taxonomy.actions";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import type { Publisher } from "@/db/schema";

// ── Edit Modal ─────────────────────────────────────────────────────────────

interface EditPublisherModalProps {
  publisher: Publisher;
  onClose:   () => void;
  onSaved:   () => void;
}

const editInitial: { error?: string; data?: undefined } = {};

function EditPublisherModal({ publisher, onClose, onSaved }: EditPublisherModalProps) {
  const boundUpdate = updatePublisherAction.bind(null, publisher.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, editInitial);
  const [logoUrl, setLogoUrl] = useState(publisher.logoUrl ?? "");
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="বন্ধ করুন"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-5 text-base font-bold text-gray-900">
          প্রকাশনী সম্পাদনা করুন
        </h3>

        {state.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={handleAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              প্রকাশনীর নাম *
            </label>
            <input
              name="name"
              required
              defaultValue={publisher.name}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          <CloudinaryImageUpload
            folder="publishers"
            label="প্রকাশনীর লোগো"
            hiddenFieldName="logoUrl"
            currentUrl={logoUrl || null}
            onUpload={setLogoUrl}
          />

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

export function AdminPublishersPage() {
  const [rows, setRows]           = useState<Publisher[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl]     = useState("");
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  const [createState, createAction, isPending] = useActionState(
    createPublisherAction,
    createInitial,
  );

  async function load() {
    setLoading(true);
    const res = await getPublishersAction();
    if (res.data) setRows(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (createState.data) {
      setLogoUrl("");
      load();
    }
  }, [createState.data]);

  async function handleDelete(id: string) {
    if (!confirm("এই প্রকাশনীকে মুছে ফেলবেন?")) return;
    setDeleteError(null);
    const res = await deletePublisherAction(id);
    if (res.error) setDeleteError(res.error);
    else load();
  }

  return (
    <div>
      {editingPublisher && (
        <EditPublisherModal
          publisher={editingPublisher}
          onClose={() => setEditingPublisher(null)}
          onSaved={() => { setEditingPublisher(null); load(); }}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Publishers</h1>
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
          নতুন প্রকাশনী যোগ করুন
        </h2>

        {createState.error && (
          <p className="mb-3 text-sm text-red-600">{createState.error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              প্রকাশনীর নাম (বাংলা) *
            </label>
            <input
              name="name"
              required
              placeholder="যেমন: সমকালীন প্রকাশন"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div className="sm:col-span-2">
            <CloudinaryImageUpload
              folder="publishers"
              label="প্রকাশনীর লোগো"
              hiddenFieldName="logoUrl"
              currentUrl={logoUrl || null}
              onUpload={setLogoUrl}
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
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                  কোনো প্রকাশনী নেই
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingPublisher(r)}
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
