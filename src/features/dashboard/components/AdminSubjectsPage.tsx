"use client";

/**
 * AdminSubjectsPage
 * List, create, and delete subjects. Requires subjects:manage permission.
 */
import { useEffect, useActionState, useState } from "react";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import {
  getActiveSubjectsAction,
  createSubjectAction,
  deleteSubjectAction,
} from "@/features/subjects/actions/subjects.actions";

type SubjectRow = { id: string; title: string; slug: string };

const createInitial: { error?: string; data?: { id: string } } = {};

export function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createState, createAction, isPending] = useActionState(
    createSubjectAction,
    createInitial,
  );

  async function load() {
    setLoading(true);
    const res = await getActiveSubjectsAction();
    if (res.data) setSubjects(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Reload after successful create
  useEffect(() => {
    if (createState.data) load();
  }, [createState.data]);

  async function handleDelete(id: string) {
    setDeleteError(null);
    const res = await deleteSubjectAction(id);
    if (res.error) setDeleteError(res.error);
    else load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Subjects</h1>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Create form */}
      <form action={createAction} className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">নতুন বিষয় তৈরি করুন</h2>
        {createState.error && (
          <p className="mb-3 text-sm text-red-600">{createState.error}</p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input name="title" required placeholder="বিষয়ের নাম (বাংলা)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
          <input name="slug" required placeholder="slug (e.g. islamic-books)"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, hyphens"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
          <input name="sortOrder" type="number" placeholder="Sort order (0)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
        </div>
        <button type="submit" disabled={isPending}
          className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
          <Plus className="size-4" />
          {isPending ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
        </button>
      </form>

      {/* Error */}
      {deleteError && <p className="mb-3 text-sm text-red-600">{deleteError}</p>}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">লোড হচ্ছে...</td></tr>
            ) : subjects.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">কোনো বিষয় নেই</td></tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(s.id)}
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
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
