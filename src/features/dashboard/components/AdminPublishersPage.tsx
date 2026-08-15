"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Publisher } from "@/db/schema";
import { getPublishersAction } from "@/features/books/actions/taxonomy.actions";
import {
  PublishersHeader,
  PublishersInsightCards,
  PublishersFilterBar,
  PublishersTable,
  PublishersPagination,
  PublisherViewModal,
  PublisherEditModal,
  PublisherCreateModal,
  PublisherDeleteModal,
  PublishersToast,
  type PublisherFilterState,
  type PublisherLogoFilter,
  type PublisherInsights,
  type ToastMessage,
} from "./publishers";

export function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPublisher, setViewingPublisher] = useState<Publisher | null>(null);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [deletingPublisher, setDeletingPublisher] = useState<Publisher | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<PublisherFilterState>({
    search: "",
    logoStatus: "all",
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
      const res = await getPublishersAction();
      if (res.data) setPublishers(res.data);
    } catch {
      showToast("error", "Failed to load publishers data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: PublisherInsights = useMemo(() => {
    let withLogo = 0;
    let withoutLogo = 0;

    for (const p of publishers) {
      if (p.logoUrl) {
        withLogo++;
      } else {
        withoutLogo++;
      }
    }

    return {
      total: publishers.length,
      withLogo,
      withoutLogo,
    };
  }, [publishers]);

  // Filtered publishers
  const filteredPublishers = useMemo(() => {
    return publishers.filter((pub) => {
      // 1. Search by name or ID
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesName = pub.name.toLowerCase().includes(query);
        const matchesId = pub.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      // 2. Logo status
      if (filters.logoStatus === "has_logo" && !pub.logoUrl) return false;
      if (filters.logoStatus === "no_logo" && pub.logoUrl) return false;

      // 3. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(pub.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [publishers, filters]);

  // Paginated slice
  const paginatedPublishers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPublishers.slice(start, start + pageSize);
  }, [filteredPublishers, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedPublishers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedPublishers.map((p) => p.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<PublisherFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      logoStatus: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <PublishersToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <PublishersHeader
        totalCount={publishers.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <PublishersInsightCards
        insights={insights}
        activeStatus={filters.logoStatus}
        onSelectFilter={(status: PublisherLogoFilter) => {
          handleFilterChange({
            logoStatus: filters.logoStatus === status ? "all" : status,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <PublishersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "publisher" : "publishers"} selected
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
      <PublishersTable
        publishers={paginatedPublishers}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewPublisher={(pub) => setViewingPublisher(pub)}
        onEditPublisher={(pub) => setEditingPublisher(pub)}
        onDeletePublisher={(pub) => setDeletingPublisher(pub)}
      />

      {/* Pagination Footer */}
      <PublishersPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredPublishers.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Publisher Modal */}
      {isAddModalOpen && (
        <PublisherCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(name) => {
            showToast("success", `Publisher "${name}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Publisher Modal */}
      {viewingPublisher && (
        <PublisherViewModal
          publisher={viewingPublisher}
          onClose={() => setViewingPublisher(null)}
          onEdit={() => {
            const p = viewingPublisher;
            setViewingPublisher(null);
            setEditingPublisher(p);
          }}
        />
      )}

      {/* Edit Publisher Modal */}
      {editingPublisher && (
        <PublisherEditModal
          publisher={editingPublisher}
          onClose={() => setEditingPublisher(null)}
          onSaved={(name) => {
            showToast("success", `Publisher "${name}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Publisher Modal */}
      {deletingPublisher && (
        <PublisherDeleteModal
          publisher={deletingPublisher}
          onClose={() => setDeletingPublisher(null)}
          onDeleted={(name) => {
            showToast("success", `Publisher "${name}" deleted successfully.`);
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
