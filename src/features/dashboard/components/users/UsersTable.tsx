"use client";

import React from "react";
import Image from "next/image";
import { Users, Shield, ShieldCheck, ShieldAlert, CheckCircle2, Ban } from "lucide-react";
import type { UserRow } from "./types";
import { UserActionMenu } from "./UserActionMenu";

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewUser: (user: UserRow) => void;
  onEditRole: (user: UserRow) => void;
  onToggleBan: (user: UserRow) => void;
}

export function UsersTable({
  users,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewUser,
  onEditRole,
  onToggleBan,
}: UsersTableProps) {
  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < users.length;

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#D10A13] border border-red-100">
            <ShieldAlert className="size-3" /> Admin
          </span>
        );
      case "moderator":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
            <ShieldCheck className="size-3" /> Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-200">
            Customer
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#fcfdfe] border-b border-gray-100 text-gray-500 font-medium select-none">
            <tr>
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 font-semibold text-gray-600">User Profile</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Email Address</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Assigned Role</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Account Status</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Joined Date</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-4 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gray-200" />
                      <div className="h-3.5 w-28 rounded bg-gray-200" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-36 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Users className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No users found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query, role, or status filters.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedIds.includes(user.id);

                return (
                  <tr
                    key={user.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(user.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Name + Avatar */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onViewUser(user)}
                          className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-red-50 text-[#D10A13] font-bold flex items-center justify-center text-xs shadow-2xs transition-transform hover:scale-105"
                        >
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span
                          onClick={() => onViewUser(user)}
                          className="font-semibold text-xs text-gray-900 hover:text-[#D10A13] cursor-pointer transition-colors"
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                          <Ban className="size-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="size-3" /> Active
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <UserActionMenu
                        user={user}
                        onView={onViewUser}
                        onEditRole={onEditRole}
                        onToggleBan={onToggleBan}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
