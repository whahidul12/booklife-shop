"use client";

import React from "react";
import Image from "next/image";
import { User, Feather, Image as ImageIcon } from "lucide-react";
import type { Author } from "@/db/schema";
import { AuthorActionMenu } from "./AuthorActionMenu";

interface AuthorsTableProps {
  authors: Author[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onViewAuthor: (author: Author) => void;
  onEditAuthor: (author: Author) => void;
  onDeleteAuthor: (author: Author) => void;
}

export function AuthorsTable({
  authors,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewAuthor,
  onEditAuthor,
  onDeleteAuthor,
}: AuthorsTableProps) {
  const allSelected = authors.length > 0 && selectedIds.length === authors.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < authors.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
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
              <th className="px-4 py-4 font-semibold text-gray-600">Author</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Author ID</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Biography</th>
              <th className="px-4 py-4 font-semibold text-gray-600">Photo</th>
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
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gray-200" />
                      <div className="h-3.5 w-32 rounded bg-gray-200" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-40 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto size-6 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : authors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                    <Feather className="size-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No authors found</h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search query or filters.
                  </p>
                </td>
              </tr>
            ) : (
              authors.map((author) => {
                const isSelected = selectedIds.includes(author.id);

                return (
                  <tr
                    key={author.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? "bg-red-50/20" : "hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(author.id)}
                        className="size-4 rounded border-gray-300 text-[#D10A13] focus:ring-[#D10A13] accent-[#D10A13] cursor-pointer"
                      />
                    </td>

                    {/* Author Photo + Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onViewAuthor(author)}
                          className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-2xs transition-transform hover:scale-105 flex items-center justify-center"
                        >
                          {author.imageUrl ? (
                            <Image
                              src={author.imageUrl}
                              alt={author.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <User className="size-4.5 text-gray-400" />
                          )}
                        </div>
                        <span
                          onClick={() => onViewAuthor(author)}
                          className="font-semibold text-xs text-gray-900 hover:text-[#D10A13] cursor-pointer transition-colors"
                        >
                          {author.name}
                        </span>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500">
                      {author.id}
                    </td>

                    {/* Bio Snippet */}
                    <td className="px-4 py-3.5 max-w-[240px]">
                      <p
                        className="truncate text-xs text-gray-600 cursor-pointer"
                        onClick={() => onViewAuthor(author)}
                        title={author.bio || ""}
                      >
                        {author.bio || <span className="italic text-gray-400">No biography</span>}
                      </p>
                    </td>

                    {/* Photo Status */}
                    <td className="px-4 py-3.5">
                      {author.imageUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                          <ImageIcon className="size-3" /> Photo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-200">
                          No Photo
                        </span>
                      )}
                    </td>

                    {/* Added Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <AuthorActionMenu
                        author={author}
                        onView={onViewAuthor}
                        onEdit={onEditAuthor}
                        onDelete={onDeleteAuthor}
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
