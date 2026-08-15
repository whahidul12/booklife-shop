"use client";

import React from "react";
import Image from "next/image";
import { X, User as UserIcon, Shield, Pencil, Calendar, Mail, CheckCircle2, Ban } from "lucide-react";
import type { UserRow } from "./types";

interface UserViewModalProps {
  user: UserRow;
  onClose: () => void;
  onEditRole: () => void;
}

export function UserViewModal({
  user,
  onClose,
  onEditRole,
}: UserViewModalProps) {
  const role = user.role || "customer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#D10A13]">
              <UserIcon className="size-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">User Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Avatar & User Details */}
          <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md bg-red-100 text-[#D10A13] flex items-center justify-center font-bold text-2xl mb-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-base font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail className="size-3.5" />
              <span>{user.email}</span>
            </p>
            <p className="font-mono text-[11px] text-gray-400 mt-1">ID: {user.id}</p>
          </div>

          {/* Status & Role Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Assigned Role</p>
              <p className="text-xs font-bold text-gray-900 mt-1 capitalize flex items-center gap-1.5">
                <Shield className="size-3.5 text-blue-600" />
                <span>{role}</span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <p className="text-[11px] font-medium text-gray-500">Account Status</p>
              <div className="mt-1">
                {user.banned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                    <Ban className="size-3" /> Banned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3" /> Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <p className="text-[11px] font-medium text-gray-500">Joined Date</p>
            <p className="text-xs font-semibold text-gray-800 mt-1">
              {new Date(user.createdAt).toLocaleDateString()} at{" "}
              {new Date(user.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditRole();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D10A13] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b5080f] transition-all"
          >
            <Shield className="size-3.5" />
            <span>Change Staff Role</span>
          </button>
        </div>
      </div>
    </div>
  );
}
