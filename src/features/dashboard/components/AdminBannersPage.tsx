"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Banner } from "@/db/schema";
import {
  getAllBannersAction,
  toggleBannerActiveAction,
} from "@/features/banners/actions/banners.actions";
import {
  BannersHeader,
  BannersInsightCards,
  BannersFilterBar,
  BannersTable,
  BannersPagination,
  BannerViewModal,
  BannerEditModal,
  BannerCreateModal,
  BannerDeleteModal,
  BannersToast,
  type BannerFilterState,
  type BannerTypeFilter,
  type BannerInsights,
  type ToastMessage,
} from "./banners";

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingBanner, setViewingBanner] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<BannerFilterState>({
    search: "",
    type: "all",
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
      const res = await getAllBannersAction();
      if (res.data) setBanners(res.data);
    } catch {
      showToast("error", "Failed to load banners data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: BannerInsights = useMemo(() => {
    let activeCount = 0;
    let heroCount = 0;
    let categoryCount = 0;

    for (const b of banners) {
      if (b.isActive) activeCount++;
      if (b.type === "hero") heroCount++;
      if (b.type === "category") categoryCount++;
    }

    return {
      total: banners.length,
      activeCount,
      heroCount,
      categoryCount,
    };
  }, [banners]);

  // Filtered banners
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      // 1. Search by title, linkUrl, or ID
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesTitle = (banner.title || "").toLowerCase().includes(query);
        const matchesLink = (banner.linkUrl || "").toLowerCase().includes(query);
        const matchesId = banner.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLink && !matchesId) return false;
      }

      // 2. Banner type
      if (filters.type === "hero" && banner.type !== "hero") return false;
      if (filters.type === "category" && banner.type !== "category") return false;

      // 3. Status
      if (filters.status === "active" && !banner.isActive) return false;
      if (filters.status === "inactive" && banner.isActive) return false;

      // 4. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(banner.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [banners, filters]);

  // Paginated slice
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBanners.slice(start, start + pageSize);
  }, [filteredBanners, currentPage, pageSize]);

  // Toggle active status
  async function handleToggleActive(banner: Banner) {
    try {
      const res = await toggleBannerActiveAction(banner.id, !banner.isActive);
      if (res.error) {
        showToast("error", res.error);
      } else {
        showToast(
          "success",
          `Banner "${banner.title || banner.id}" is now ${!banner.isActive ? "active" : "inactive"}.`
        );
        loadData();
      }
    } catch {
      showToast("error", "Failed to update banner status");
    }
  }

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedBanners.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBanners.map((b) => b.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<BannerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      status: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <BannersToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <BannersHeader
        totalCount={banners.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <BannersInsightCards
        insights={insights}
        activeType={filters.type}
      // onSelectType={(type: BannerTypeFilter) => {
      //   handleFilterChange({
      //     type: filters.type === type ? "all" : type,
      //   });
      // }}
      />

      {/* Filter and Search Bar */}
      <BannersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "banner" : "banners"} selected
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
      <BannersTable
        banners={paginatedBanners}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewBanner={(b) => setViewingBanner(b)}
        onEditBanner={(b) => setEditingBanner(b)}
        onToggleActiveBanner={handleToggleActive}
        onDeleteBanner={(b) => setDeletingBanner(b)}
      />

      {/* Pagination Footer */}
      <BannersPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredBanners.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Banner Modal */}
      {isAddModalOpen && (
        <BannerCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(title) => {
            showToast("success", `Banner "${title}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Banner Modal */}
      {viewingBanner && (
        <BannerViewModal
          banner={viewingBanner}
          onClose={() => setViewingBanner(null)}
          onEdit={() => {
            const b = viewingBanner;
            setViewingBanner(null);
            setEditingBanner(b);
          }}
        />
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <BannerEditModal
          banner={editingBanner}
          onClose={() => setEditingBanner(null)}
          onSaved={(title) => {
            showToast("success", `Banner "${title}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Banner Modal */}
      {deletingBanner && (
        <BannerDeleteModal
          banner={deletingBanner}
          onClose={() => setDeletingBanner(null)}
          onDeleted={(title) => {
            showToast("success", `Banner "${title}" deleted successfully.`);
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
