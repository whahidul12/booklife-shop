"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  UsersHeader,
  UsersInsightCards,
  UsersFilterBar,
  UsersTable,
  UsersPagination,
  UserViewModal,
  UserEditModal,
  UserCreateModal,
  UserBanModal,
  UsersToast,
  type UserFilterState,
  type UserRoleFilter,
  type UserInsights,
  type UserRow,
  type ToastMessage,
} from "./users";

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [banningUser, setBanningUser] = useState<UserRow | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<UserFilterState>({
    search: "",
    role: "all",
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
      const res = await authClient.admin.listUsers({
        query: { limit: 100 },
      });
      if (res.data?.users) {
        setUsers(
          res.data.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u as { role?: string }).role || "customer",
            banned: (u as { banned?: boolean }).banned || false,
            image: u.image,
            createdAt: u.createdAt,
          }))
        );
      }
    } catch {
      showToast("error", "Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: UserInsights = useMemo(() => {
    let customers = 0;
    let moderators = 0;
    let admins = 0;
    let banned = 0;

    for (const u of users) {
      if (u.banned) banned++;
      if (u.role === "admin") admins++;
      else if (u.role === "moderator") moderators++;
      else customers++;
    }

    return {
      total: users.length,
      customers,
      moderators,
      admins,
      banned,
    };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search by name, email, or ID
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesName = user.name.toLowerCase().includes(query);
        const matchesEmail = user.email.toLowerCase().includes(query);
        const matchesId = user.id.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId) return false;
      }

      // 2. Role filter
      if (filters.role !== "all") {
        const userRole = user.role || "customer";
        if (userRole !== filters.role) return false;
      }

      // 3. Status filter
      if (filters.status === "active" && user.banned) return false;
      if (filters.status === "banned" && !user.banned) return false;

      // 4. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(user.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) return false;
      }

      return true;
    });
  }, [users, filters]);

  // Paginated slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<UserFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <UsersToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <UsersHeader
        totalCount={users.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <UsersInsightCards
        insights={insights}
        activeRole={filters.role}
      // onSelectRole={(role: UserRoleFilter) => {
      //   handleFilterChange({
      //     role: filters.role === role ? "all" : role,
      //   });
      // }}
      />

      {/* Filter and Search Bar */}
      <UsersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "user" : "users"} selected
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
      <UsersTable
        users={paginatedUsers}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewUser={(u) => setViewingUser(u)}
        onEditRole={(u) => setEditingUser(u)}
        onToggleBan={(u) => setBanningUser(u)}
      />

      {/* Pagination Footer */}
      <UsersPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <UserCreateModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(name) => {
            showToast("success", `User "${name}" created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View User Modal */}
      {viewingUser && (
        <UserViewModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onEditRole={() => {
            const u = viewingUser;
            setViewingUser(null);
            setEditingUser(u);
          }}
        />
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(role) => {
            showToast("success", `Role for "${editingUser.name}" updated to ${role}.`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Ban / Unban Modal */}
      {banningUser && (
        <UserBanModal
          user={banningUser}
          onClose={() => setBanningUser(null)}
          onSuccess={(isBanned) => {
            showToast(
              "success",
              `User "${banningUser.name}" has been ${isBanned ? "banned" : "unbanned"}.`
            );
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
