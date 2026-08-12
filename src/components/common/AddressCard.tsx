"use client";
import { useEffect, useState, useActionState, useRef } from "react";
import { Edit2, X, Plus, Check, Star, RefreshCw } from "lucide-react";
import {
  getMyAddressesAction,
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/features/users/actions/addresses.actions";
import type { Address } from "@/db/schema";

// Inline form for add / edit

const addInitial: { error?: string; data?: { id: string } } = {};
const updateInitial: { error?: string; data?: undefined } = {};

interface AddressFormProps {
  initial?: Partial<Address>;
  mode: "add" | "edit";
  addressId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function AddressForm({ initial, mode, addressId, onSuccess, onCancel }: AddressFormProps) {
  // For add — use useActionState with addAddressAction
  const [addState, addAction, addPending] = useActionState(addAddressAction, addInitial);

  // For edit — we need to bind the addressId; wrap via a closure
  const boundUpdate = updateAddressAction.bind(null, addressId ?? "");
  const [editState, editAction, editPending] = useActionState(boundUpdate, updateInitial);

  const isPending = mode === "add" ? addPending : editPending;
  const error = mode === "add" ? addState.error : editState.error;

  // Track how many times the action has been called so we can detect completion
  const addCallCount = useRef(0);
  const editCallCount = useRef(0);

  useEffect(() => {
    if (mode === "add") {
      if (addState.data && !addState.error) {
        addCallCount.current += 1;
        onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState]);

  useEffect(() => {
    if (mode === "edit" && !editPending && !editState.error && editCallCount.current > 0) {
      onSuccess();
    }
    if (editPending) editCallCount.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editState, editPending]);

  const action = mode === "add" ? addAction : editAction;

  return (
    <form
      action={action}
      className="space-y-2 rounded-md border border-red-200 bg-red-50 p-4"
    >
      {error && (
        <p className="rounded bg-red-100 px-3 py-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <input
          name="recipientName"
          defaultValue={initial?.recipientName ?? ""}
          placeholder="প্রাপকের নাম *"
          required
          className="col-span-2 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="phone"
          defaultValue={initial?.phone ?? ""}
          placeholder="ফোন নম্বর *"
          required
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="label"
          defaultValue={initial?.label ?? ""}
          placeholder="লেবেল (বাড়ি / অফিস)"
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="addressLine1"
          defaultValue={initial?.addressLine1 ?? ""}
          placeholder="ঠিকানা লাইন ১ *"
          required
          className="col-span-2 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="addressLine2"
          defaultValue={initial?.addressLine2 ?? ""}
          placeholder="ঠিকানা লাইন ২"
          className="col-span-2 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="city"
          defaultValue={initial?.city ?? ""}
          placeholder="শহর *"
          required
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          name="district"
          defaultValue={initial?.district ?? ""}
          placeholder="জেলা"
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
      </div>

      {mode === "add" && (
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input type="checkbox" name="isDefault" value="true" className="accent-red-600" />
          ডিফল্ট ঠিকানা হিসেবে সেট করুন
        </label>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          <Check className="size-3" />
          {isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          বাতিল
        </button>
      </div>
    </form>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function AddressCard() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await getMyAddressesAction();
    if (res.error) setError(res.error);
    else setAddresses(res.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSetDefault(id: string) {
    setSettingDefaultId(id);
    const res = await setDefaultAddressAction(id);
    if (res.error) setError(res.error);
    else load();
    setSettingDefaultId(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await deleteAddressAction(id);
    if (res.error) setError(res.error);
    else load();
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-gray-400">
        <RefreshCw className="size-4 animate-spin" /> লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Addresses</h2>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
        >
          <RefreshCw className="size-3.5" /> রিফ্রেশ
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Existing addresses */}
        {addresses.map((addr) =>
          editingId === addr.id ? (
            <AddressForm
              key={addr.id}
              mode="edit"
              addressId={addr.id}
              initial={addr}
              onSuccess={() => { setEditingId(null); load(); }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={addr.id}
              className={`relative rounded-md border bg-white p-4 shadow-sm transition-colors ${addr.isDefault ? "border-red-500" : "border-gray-200"
                }`}
            >
              {/* Default badge */}
              {addr.isDefault && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                  <Star className="size-2.5 fill-red-500" /> ডিফল্ট
                </span>
              )}

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingId(addr.id)}
                  className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                  aria-label="ঠিকানা সম্পাদনা করুন"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  aria-label="ঠিকানা মুছুন"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Address details */}
              <h3 className={`mb-2 pr-16 font-semibold text-gray-900 ${addr.isDefault ? "mt-5" : ""}`}>
                {addr.recipientName}
                {addr.label && (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({addr.label})
                  </span>
                )}
              </h3>
              <div className="space-y-0.5 text-sm text-gray-600">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>
                  {addr.city}
                  {addr.district ? `, ${addr.district}` : ""}
                </p>
                <p>{addr.phone}</p>
              </div>

              {/* Set default button */}
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  disabled={settingDefaultId === addr.id}
                  className="mt-3 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  {settingDefaultId === addr.id ? "সেট হচ্ছে..." : "ডিফল্ট হিসেবে সেট করুন"}
                </button>
              )}
            </div>
          ),
        )}

        {/* Add new address card */}
        {showAddForm ? (
          <AddressForm
            mode="add"
            onSuccess={() => { setShowAddForm(false); load(); }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex min-h-32 items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 text-red-600 transition-colors hover:border-red-500 hover:bg-red-50"
          >
            <Plus className="size-5" />
            <span className="font-medium">ঠিকানা যোগ করুন</span>
          </button>
        )}
      </div>
    </div>
  );
}
