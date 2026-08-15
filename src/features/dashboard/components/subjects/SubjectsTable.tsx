"use client";

import React from "react";
import { Bookmark, CheckCircle2, XCircle, Tag, Layers } from "lucide-react";
import type { Subject } from "@/db/schema";
import { SubjectActionMenu } from "./SubjectActionMenu";

interface SubjectsTableProps {
  subjects: Subject[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewSubject: (subject: Subject) => void;
  onEditSubject: (subject: Subject) => void;
  onToggleActiveSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
}

export function SubjectsTable({
  subjects,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewSubject,
  onEditSubject,
  onToggleActiveSubject,
  onDeleteSubject,
}: SubjectsTableProps) {
  const allSelected = subjects.length > 0 && selectedIds.length === subjects.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < subjects.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs">
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
              <th className="px-4 py-4 font-semibold text-gray-600">Subject Name</th>
              <th className="px-4 py-4 font-semibold text-gray-600">URL Slug</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Sort Priority</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Added Date</th>
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
                    <div className="h-3.5 w-32 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-12 rounded bg-gray-200" />
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
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Bookmark className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No subjects found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query or status filters.
                  </p>
                </td>
              </tr>
            ) : (
              subjects.map((subject) => {
                const isSelected = selectedIds.includes(subject.id);

                return (
                  <tr
                    key={subject.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(subject.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Subject Title */}
                    <td className="px-4 py-3.5 font-semibold text-xs text-gray-900">
                      <span
                        onClick={() => onViewSubject(subject)}
                        className="hover:text-[#D10A13] cursor-pointer transition-colors"
                      >
                        {subject.title}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500">
                      <span className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                        /{subject.slug}
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      {subject.sortOrder ?? "0"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {subject.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="size-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-100">
                          <XCircle className="size-3" /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Added Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <SubjectActionMenu
                        subject={subject}
                        onView={onViewSubject}
                        onEdit={onEditSubject}
                        onToggleActive={onToggleActiveSubject}
                        onDelete={onDeleteSubject}
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
