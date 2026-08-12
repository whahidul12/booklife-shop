"use client";

import { useEffect, useActionState, useState } from "react";
import { Trash2, Plus, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getCouponsAction,
  createCouponAction,
  deleteCouponAction,
  toggleCouponActiveAction,
} from "@/features/orders/actions/coupons.actions";
import type { Coupon } from "@/db/schema";

const createInitial: { error?: string; data?: { id: string } } = {};

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createState, createAction, isPending] = useActionState(createCouponAction, createInitial);

  async function load() {
    setLoading(true);
    const res = await getCouponsAction();
    if (res.data) setCoupons(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (createState.data) load(); }, [createState.data]);

  async function handleDelete(id: string) {
    setActionError(null);
    const res = await deleteCouponAction(id);
    if (res.error) setActionError(res.error);
    else load();
  }

  async function handleToggle(id: string, current: boolean) {
    setActionError(null);
    const res = await toggleCouponActiveAction(id, !current);
    if (res.error) setActionError(res.error);
    else load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      <form action={createAction} className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">নতুন কুপন তৈরি করুন</h2>
        {createState.error && <p className="mb-3 text-sm text-red-600">{createState.error}</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input name="code" required placeholder="কুপন কোড (e.g. EID50)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
          <input name="discountTaka" type="number" required min="1" step="1" placeholder="ছাড়ের পরিমাণ (৳)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
          <input name="maxUses" type="number" min="1" placeholder="সর্বোচ্চ ব্যবহার (খালি = সীমাহীন)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
          <input name="expiresAt" type="datetime-local" placeholder="মেয়াদ শেষ তারিখ"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400" />
        </div>
        <button type="submit" disabled={isPending}
          className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
          <Plus className="size-4" />
          {isPending ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
        </button>
      </form>

      {actionError && <p className="mb-3 text-sm text-red-600">{actionError}</p>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Discount (৳)</th>
              <th className="px-4 py-3 text-left font-medium">Uses</th>
              <th className="px-4 py-3 text-left font-medium">Expires</th>
              <th className="px-4 py-3 text-left font-medium">Active</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">লোড হচ্ছে...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">কোনো কুপন নেই</td></tr>
            ) : coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold text-gray-900">{c.code}</td>
                <td className="px-4 py-3 text-gray-700">{(c.discountPaisa / 100).toFixed(0)}</td>
                <td className="px-4 py-3 text-gray-600">
                  {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {c.expiresAt
                    ? new Date(c.expiresAt).toLocaleDateString("bn-BD")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(c.id, c.isActive)}
                    className={`inline-flex items-center gap-1 text-xs font-medium ${c.isActive ? "text-green-600" : "text-gray-400"}`}>
                    {c.isActive ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
