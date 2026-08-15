"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Subject } from "@/db/schema";
import {
  getAllSubjectsAction,
  toggleSubjectActiveAction,
} from "@/features/subjects/actions/subjects.actions";
import {
  SubjectsHeader,
  SubjectsInsightCards,
  SubjectsFilterBar,
  SubjectsTable,
  SubjectsPagination,
  SubjectViewModal,
  SubjectEditModal,
  SubjectCreateModal,
  SubjectDeleteModal,
  SubjectsToast,
  type SubjectFilterState,
  type SubjectStatusFilter,
  type SubjectInsights,
  type ToastMessage,
} from "./subjects";

export function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<SubjectFilterState>({
    search: "",
    status: "all",
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
      const res = await getAllSubjectsAction();
      if (res.data) setSubjects(res.data);
    } catch {
      showToast("error", "Failed to load subjects data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: SubjectInsights = useMemo(() => {
    let activeCount = 0;
    let inactiveCount = 0;

    for (const s of subjects) {
      if (s.isActive) activeCount++;
      else inactiveCount++;
    }

    return {
      total: subjects.length,
      activeCount,
      inactiveCount,
    };
  }, [subjects]);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // 1. Search by title, slug, or ID
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesTitle = subject.title.toLowerCase().includes(query);
        const matchesSlug = subject.slug.toLowerCase().includes(query);
        const matchesId = subject.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSlug && !matchesId) return false;
      }

      // 2. Status
      if (filters.status === "active" && !subject.isActive) return false;
      if (filters.status === "inactive" && subject.isActive) return false;

      // 3. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(subject.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [subjects, filters]);

  // Paginated slice
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubjects.slice(start, start + pageSize);
  }, [filteredSubjects, currentPage, pageSize]);

  // Toggle active status
  async function handleToggleActive(subject: Subject) {
    try {
      const res = await toggleSubjectActiveAction(subject.id, !subject.isActive);
      if (res.error) {
        showToast("error", res.error);
      } else {
        showToast(
          "success",
          `Subject "${subject.title}" is now ${!subject.isActive ? "active" : "inactive"}.`
        );
        loadData();
      }
    } catch {
      showToast("error", "Failed to update status");
    }
  }

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedSubjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSubjects.map((s) => s.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<SubjectFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <SubjectsToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <SubjectsHeader
        totalCount={subjects.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <SubjectsInsightCards
        insights={insights}
        activeStatus={filters.status}
        onSelectFilter={(status: SubjectStatusFilter) => {
          handleFilterChange({
            status: filters.status === status ? "all" : status,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <SubjectsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "subject" : "subjects"} selected
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
      <SubjectsTable
        subjects={paginatedSubjects}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewSubject={(s) => setViewingSubject(s)}
        onEditSubject={(s) => setEditingSubject(s)}
        onToggleActiveSubject={handleToggleActive}
        onDeleteSubject={(s) => setDeletingSubject(s)}
      />

      {/* Pagination Footer */}
      <SubjectsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredSubjects.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <SubjectCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(title) => {
            showToast("success", `Subject "${title}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Subject Modal */}
      {viewingSubject && (
        <SubjectViewModal
          subject={viewingSubject}
          onClose={() => setViewingSubject(null)}
          onEdit={() => {
            const s = viewingSubject;
            setViewingSubject(null);
            setEditingSubject(s);
          }}
          onToggleActive={() => handleToggleActive(viewingSubject)}
        />
      )}

      {/* Edit Subject Modal */}
      {editingSubject && (
        <SubjectEditModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSaved={(title) => {
            showToast("success", `Subject "${title}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Subject Modal */}
      {deletingSubject && (
        <SubjectDeleteModal
          subject={deletingSubject}
          onClose={() => setDeletingSubject(null)}
          onDeleted={(title) => {
            showToast("success", `Subject "${title}" deleted successfully.`);
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
