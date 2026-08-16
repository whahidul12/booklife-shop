"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Author } from "@/db/schema";
import { getAuthorsAction } from "@/features/books/actions/taxonomy.actions";
import {
  AuthorsHeader,
  AuthorsInsightCards,
  AuthorsFilterBar,
  AuthorsTable,
  AuthorsPagination,
  AuthorViewModal,
  AuthorEditModal,
  AuthorCreateModal,
  AuthorDeleteModal,
  AuthorsToast,
  type AuthorFilterState,
  type AuthorPhotoFilter,
  type AuthorInsights,
  type ToastMessage,
} from "./authors";

export function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAuthor, setViewingAuthor] = useState<Author | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<AuthorFilterState>({
    search: "",
    photoStatus: "all",
    dateRange: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Show Toast helper
  const showToast = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      setToast({
        id: Math.random().toString(36).slice(2),
        type,
        message,
      });
    },
    []
  );

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAuthorsAction();
      if (res.data) setAuthors(res.data);
    } catch {
      showToast("error", "Failed to load authors data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: AuthorInsights = useMemo(() => {
    let withPhoto = 0;
    let withBio = 0;

    for (const a of authors) {
      if (a.imageUrl) withPhoto++;
      if (a.bio && a.bio.trim() !== "") withBio++;
    }

    return {
      total: authors.length,
      withPhoto,
      withBio,
    };
  }, [authors]);

  // Filtered authors
  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      // 1. Search by name, bio, or ID
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesName = author.name.toLowerCase().includes(query);
        const matchesBio = (author.bio || "").toLowerCase().includes(query);
        const matchesId = author.id.toLowerCase().includes(query);
        if (!matchesName && !matchesBio && !matchesId) return false;
      }

      // 2. Photo status
      if (filters.photoStatus === "has_photo" && !author.imageUrl) return false;
      if (filters.photoStatus === "no_photo" && author.imageUrl) return false;

      // 3. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(author.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [authors, filters]);

  // Paginated slice
  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAuthors.slice(start, start + pageSize);
  }, [filteredAuthors, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedAuthors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedAuthors.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<AuthorFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      photoStatus: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <AuthorsToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <AuthorsHeader
        totalCount={authors.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <AuthorsInsightCards
        insights={insights}
        activeStatus={filters.photoStatus}
      // onSelectFilter={(status: AuthorPhotoFilter) => {
      //   handleFilterChange({
      //     photoStatus: filters.photoStatus === status ? "all" : status,
      //   });
      // }}
      />

      {/* Filter and Search Bar */}
      <AuthorsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "author" : "authors"} selected
          </span>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="font-medium text-gray-500 hover:text-gray-800"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Main Table */}
      <AuthorsTable
        authors={paginatedAuthors}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewAuthor={(a) => setViewingAuthor(a)}
        onEditAuthor={(a) => setEditingAuthor(a)}
        onDeleteAuthor={(a) => setDeletingAuthor(a)}
      />

      {/* Pagination Footer */}
      <AuthorsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredAuthors.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Author Modal */}
      {isAddModalOpen && (
        <AuthorCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(name) => {
            showToast("success", `Author "${name}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Author Modal */}
      {viewingAuthor && (
        <AuthorViewModal
          author={viewingAuthor}
          onClose={() => setViewingAuthor(null)}
          onEdit={() => {
            const a = viewingAuthor;
            setViewingAuthor(null);
            setEditingAuthor(a);
          }}
        />
      )}

      {/* Edit Author Modal */}
      {editingAuthor && (
        <AuthorEditModal
          author={editingAuthor}
          onClose={() => setEditingAuthor(null)}
          onSaved={(name) => {
            showToast("success", `Author "${name}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Author Modal */}
      {deletingAuthor && (
        <AuthorDeleteModal
          author={deletingAuthor}
          onClose={() => setDeletingAuthor(null)}
          onDeleted={(name) => {
            showToast("success", `Author "${name}" deleted successfully.`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}
    </div>
  );
}
