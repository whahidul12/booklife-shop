"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Coupon } from "@/db/schema";
import {
  getCouponsAction,
  toggleCouponActiveAction,
} from "@/features/orders/actions/coupons.actions";
import {
  CouponsHeader,
  CouponsInsightCards,
  CouponsFilterBar,
  CouponsTable,
  CouponsPagination,
  CouponViewModal,
  CouponEditModal,
  CouponCreateModal,
  CouponDeleteModal,
  CouponsToast,
  type CouponFilterState,
  type CouponStatusFilter,
  type CouponInsights,
  type ToastMessage,
} from "./coupons";

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<CouponFilterState>({
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

  // Load coupons
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCouponsAction();
      if (res.data) setCoupons(res.data);
    } catch {
      showToast("error", "Failed to load coupons data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: CouponInsights = useMemo(() => {
    let activeCount = 0;
    let expiredCount = 0;
    let totalUses = 0;

    const now = new Date();

    for (const c of coupons) {
      totalUses += c.usedCount;
      const isExpired = c.expiresAt && new Date(c.expiresAt) < now;
      if (c.isActive && !isExpired) {
        activeCount++;
      } else {
        expiredCount++;
      }
    }

    return {
      total: coupons.length,
      activeCount,
      totalUses,
      expiredCount,
    };
  }, [coupons]);

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    const now = new Date();

    return coupons.filter((c) => {
      // 1. Search by code
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toUpperCase();
        if (!c.code.toUpperCase().includes(query)) return false;
      }

      const isExpired = c.expiresAt && new Date(c.expiresAt) < now;
      const isMaxed = c.maxUses !== null && c.usedCount >= c.maxUses;

      // 2. Status
      if (filters.status === "active") {
        if (!c.isActive || isExpired || isMaxed) return false;
      } else if (filters.status === "inactive") {
        if (c.isActive) return false;
      } else if (filters.status === "expired") {
        if (!isExpired) return false;
      } else if (filters.status === "maxed") {
        if (!isMaxed) return false;
      }

      // 3. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(c.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [coupons, filters]);

  // Paginated coupons slice
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCoupons.slice(start, start + pageSize);
  }, [filteredCoupons, currentPage, pageSize]);

  // Toggle Active Status
  async function handleToggleActive(coupon: Coupon) {
    try {
      const res = await toggleCouponActiveAction(coupon.id, !coupon.isActive);
      if (res.error) {
        showToast("error", res.error);
      } else {
        showToast(
          "success",
          `Coupon "${coupon.code}" is now ${!coupon.isActive ? "active" : "inactive"}.`
        );
        loadData();
      }
    } catch {
      showToast("error", "Failed to update coupon status");
    }
  }

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedCoupons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCoupons.map((c) => c.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<CouponFilterState>) => {
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
      <CouponsToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <CouponsHeader
        totalCount={coupons.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <CouponsInsightCards
        insights={insights}
        activeStatus={filters.status}
        onSelectFilter={(status: CouponStatusFilter) => {
          handleFilterChange({
            status: filters.status === status ? "all" : status,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <CouponsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "coupon" : "coupons"} selected
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

      {/* Main Coupons Table */}
      <CouponsTable
        coupons={paginatedCoupons}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewCoupon={(c) => setViewingCoupon(c)}
        onEditCoupon={(c) => setEditingCoupon(c)}
        onToggleActiveCoupon={handleToggleActive}
        onDeleteCoupon={(c) => setDeletingCoupon(c)}
      />

      {/* Pagination Footer */}
      <CouponsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredCoupons.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Coupon Modal */}
      {isAddModalOpen && (
        <CouponCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(code) => {
            showToast("success", `Coupon "${code}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Coupon Details Modal */}
      {viewingCoupon && (
        <CouponViewModal
          coupon={viewingCoupon}
          onClose={() => setViewingCoupon(null)}
          onEdit={() => {
            const c = viewingCoupon;
            setViewingCoupon(null);
            setEditingCoupon(c);
          }}
          onToggleActive={() => handleToggleActive(viewingCoupon)}
        />
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <CouponEditModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSaved={(code) => {
            showToast("success", `Coupon "${code}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Coupon Modal */}
      {deletingCoupon && (
        <CouponDeleteModal
          coupon={deletingCoupon}
          onClose={() => setDeletingCoupon(null)}
          onDeleted={(code) => {
            showToast("success", `Coupon "${code}" deleted successfully.`);
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
