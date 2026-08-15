"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Order } from "@/db/schema";
import {
  getAllOrdersAction,
  updateOrderStatusAction,
} from "@/features/orders/actions/orders.actions";
import {
  OrdersHeader,
  OrdersInsightCards,
  OrdersFilterBar,
  OrdersTable,
  OrdersPagination,
  OrderViewModal,
  OrderEditStatusModal,
  OrderDeleteModal,
  OrdersToast,
  type OrderFilterState,
  type OrderStatusFilter,
  type OrderStatus,
  type OrderInsights,
  type ToastMessage,
} from "./orders";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<OrderFilterState>({
    search: "",
    status: "all",
    paymentMethod: "all",
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
      const res = await getAllOrdersAction();
      if (res.data) setOrders(res.data);
    } catch {
      showToast("error", "Failed to load orders data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: OrderInsights = useMemo(() => {
    let pendingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let totalRevenuePaisa = 0;

    for (const o of orders) {
      if (o.status === "pending") pendingCount++;
      if (o.status === "shipped") shippedCount++;
      if (o.status === "delivered") {
        deliveredCount++;
        totalRevenuePaisa += o.totalPaisa;
      }
    }

    return {
      total: orders.length,
      pendingCount,
      shippedCount,
      deliveredCount,
      totalRevenuePaisa,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search by Order ID or shipping address snapshot
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesAddr = (order.shippingAddressSnapshot || "").toLowerCase().includes(query);
        const matchesNote = (order.deliveryNote || "").toLowerCase().includes(query);
        if (!matchesId && !matchesAddr && !matchesNote) return false;
      }

      // 2. Status
      if (filters.status !== "all" && order.status !== filters.status) return false;

      // 3. Payment Method
      if (filters.paymentMethod !== "all" && order.paymentMethod !== filters.paymentMethod) return false;

      // 4. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(order.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [orders, filters]);

  // Paginated slice
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<OrderFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      paymentMethod: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <OrdersToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <OrdersHeader
        totalCount={orders.length}
        loading={loading}
        onRefresh={loadData}
      />

      {/* KPI Insight Metric Cards */}
      <OrdersInsightCards
        insights={insights}
        activeStatus={filters.status}
        onSelectStatus={(status: OrderStatusFilter) => {
          handleFilterChange({
            status: filters.status === status ? "all" : status,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <OrdersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "order" : "orders"} selected
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
      <OrdersTable
        orders={paginatedOrders}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewOrder={(o) => setViewingOrder(o)}
        onEditStatus={(o) => setEditingOrder(o)}
        onDeleteOrder={(o) => setDeletingOrder(o)}
      />

      {/* Pagination Footer */}
      <OrdersPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredOrders.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* View Order Invoice Modal */}
      {viewingOrder && (
        <OrderViewModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          onEditStatus={() => {
            const o = viewingOrder;
            setViewingOrder(null);
            setEditingOrder(o);
          }}
        />
      )}

      {/* Edit Order Status Modal */}
      {editingOrder && (
        <OrderEditStatusModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaved={(newStatus) => {
            showToast("success", `Order #${editingOrder.id} status changed to ${newStatus}.`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Order Modal */}
      {deletingOrder && (
        <OrderDeleteModal
          order={deletingOrder}
          onClose={() => setDeletingOrder(null)}
          onDeleted={(orderId) => {
            showToast("success", `Order #${orderId} deleted.`);
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
