"use client";

/**
 * AdminUsersPage
 *
 * Features:
 * - List all users (BetterAuth admin.listUsers)
 * - Create new user with name / email / password / role (admin.createUser)
 * - Change role via dropdown (admin.setRole)
 * - Ban / unban user (admin.banUser / unbanUser)
 *
 * Only accessible to admins — the dashboard layout enforces this server-side.
 */
import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, Plus, X, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  createdAt: Date | string;
};

const ROLE_OPTIONS = ["customer", "moderator", "admin"] as const;
type Role = (typeof ROLE_OPTIONS)[number];

const ROLE_COLOURS: Record<string, string> = {
  admin:     "bg-red-100 text-red-700",
  moderator: "bg-blue-100 text-blue-700",
  customer:  "bg-gray-100 text-gray-600",
};

// ── Create User Modal ────────────────────────────────────────────────────────

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreateUserModal({ onClose, onCreated }: CreateUserModalProps) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState<Role>("customer");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("সব ঘর পূরণ করুন");
      return;
    }
    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);
    try {
      // Create user via BetterAuth admin plugin
      const res = await authClient.admin.createUser({
        name:     name.trim(),
        email:    email.trim().toLowerCase(),
        password: password,
        role:     role as Parameters<typeof authClient.admin.setRole>[0]["role"],
      });

      if (res.error) {
        setError(res.error.message ?? "ব্যবহারকারী তৈরি করা যায়নি");
      } else {
        onCreated();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যবহারকারী তৈরি করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="বন্ধ করুন"
        >
          <X className="size-5" />
        </button>

        <div className="mb-5 flex items-center gap-2">
          <UserPlus className="size-5 text-red-600" />
          <h3 className="text-base font-bold text-gray-900">নতুন ব্যবহারকারী তৈরি করুন</h3>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              পূর্ণ নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Abdullah Al-Mahmun"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              পাসওয়ার্ড{" "}
              <span className="font-normal text-gray-400">(কমপক্ষে ৮ অক্ষর)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              রোল
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "admin"     ? "Admin (সুপার অ্যাডমিন)"     :
                   r === "moderator" ? "Moderator (মডারেটর)" :
                                       "Customer (গ্রাহক)"}
                </option>
              ))}
            </select>
            {role === "admin" && (
              <p className="mt-1 text-xs text-red-500">
                ⚠ Admin রোল সর্বোচ্চ ক্ষমতা দেয় — সাবধানে ব্যবহার করুন।
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <Plus className="size-4" /> তৈরি করুন
                </>
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

// ── Main Page ────────────────────────────────────────────────────────────────

export function AdminUsersPage() {
  const [users, setUsers]           = useState<UserRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function load() {
    setLoading(true);
    setActionError(null);
    try {
      const res = await authClient.admin.listUsers({ query: { limit: 200 } });
      if (res.data?.users) {
        setUsers(res.data.users as unknown as UserRow[]);
      }
    } catch {
      setActionError("ব্যবহারকারী লোড করা যায়নি");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleRoleChange(userId: string, role: string) {
    setActionError(null);
    try {
      await authClient.admin.setRole({
        userId,
        role: role as Parameters<typeof authClient.admin.setRole>[0]["role"],
      });
      load();
    } catch {
      setActionError("রোল পরিবর্তন করা যায়নি");
    }
  }

  async function handleBanToggle(user: UserRow) {
    setActionError(null);
    try {
      if (user.banned) {
        await authClient.admin.unbanUser({ userId: user.id });
      } else {
        await authClient.admin.banUser({ userId: user.id });
      }
      load();
    } catch {
      setActionError("ব্যান পরিবর্তন করা যায়নি");
    }
  }

  return (
    <div>
      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={load}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <UserPlus className="size-4" />
            নতুন ব্যবহারকারী
          </button>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            <RefreshCw className="size-4" /> Refresh
          </button>
        </div>
      </div>

      {actionError && (
        <p className="mb-3 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Change Role</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  <RefreshCw className="mx-auto mb-2 size-5 animate-spin text-gray-300" />
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  কোনো ব্যবহারকারী নেই
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {u.name}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>

                  {/* Role badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        ROLE_COLOURS[u.role ?? "customer"] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role === "admin" && <ShieldCheck className="size-3" />}
                      {u.role ?? "customer"}
                    </span>
                  </td>

                  {/* Banned badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.banned
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.banned ? "Banned" : "Active"}
                    </span>
                  </td>

                  {/* Role selector */}
                  <td className="px-4 py-3">
                    <select
                      value={u.role ?? "customer"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-red-400"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Ban / Unban */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleBanToggle(u)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        u.banned
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User count footer */}
      {!loading && users.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          মোট {users.length} জন ব্যবহারকারী
        </p>
      )}
    </div>
  );
}
