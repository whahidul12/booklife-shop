"use client";

import React from "react";
import { Plus, RefreshCw, Users } from "lucide-react";

interface UsersHeaderProps {
  totalCount: number;
  loading: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export function UsersHeader({
  totalCount,
  loading,
  onRefresh,
  onOpenAddModal,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Accounts & Roles
          </h1>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-[#D10A13] border border-red-100">
            {totalCount} Users
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Manage system users, customer accounts, staff roles (Admin/Moderator), and account status.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-[#D10A13]" : ""}`} />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D10A13] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all active:scale-95 hover:shadow-md hover:shadow-red-500/20"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
}
