"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  getAllModeratorsWithPermissionsAction,
  setModeratorPermissionsAction,
  type ModeratorWithPermissions,
  type PermissionUpdate,
} from "@/features/permissions/actions/permissions.actions";
import { PERMISSION_FIELDS } from "@/db/schema/moderator-permissions.schema";
import {
  PermissionsHeader,
  PermissionsInsightCards,
  PermissionsFilterBar,
  PermissionsMatrixTable,
  ModeratorViewModal,
  PermissionsToast,
  type PermissionFilterState,
  type PermissionAccessFilter,
  type PermissionInsights,
  type PermKey,
  type ToastMessage,
} from "./permissions";

export function AdminPermissionsPage() {
  const [moderators, setModerators] = useState<ModeratorWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Modals state
  const [viewingModerator, setViewingModerator] = useState<ModeratorWithPermissions | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<PermissionFilterState>({
    search: "",
    accessLevel: "all",
  });

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
      const res = await getAllModeratorsWithPermissionsAction();
      if (res.data) setModerators(res.data);
      else if (res.error) showToast("error", res.error);
    } catch {
      showToast("error", "Failed to load moderator permissions");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: PermissionInsights = useMemo(() => {
    let fullAccess = 0;
    let partialAccess = 0;
    let noAccess = 0;

    for (const m of moderators) {
      const activeCount = Object.values(m.permissions).filter(Boolean).length;
      if (activeCount === PERMISSION_FIELDS.length) fullAccess++;
      else if (activeCount === 0) noAccess++;
      else partialAccess++;
    }

    return {
      totalModerators: moderators.length,
      fullAccess,
      partialAccess,
      noAccess,
    };
  }, [moderators]);

  // Filtered moderators
  const filteredModerators = useMemo(() => {
    return moderators.filter((mod) => {
      // 1. Search by name or email
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesName = mod.name.toLowerCase().includes(query);
        const matchesEmail = mod.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // 2. Access level filter
      const activeCount = Object.values(mod.permissions).filter(Boolean).length;
      if (filters.accessLevel === "full" && activeCount !== PERMISSION_FIELDS.length) return false;
      if (filters.accessLevel === "partial" && (activeCount === 0 || activeCount === PERMISSION_FIELDS.length)) return false;
      if (filters.accessLevel === "none" && activeCount !== 0) return false;

      return true;
    });
  }, [moderators, filters]);

  // Toggle single permission
  async function handleToggle(
    moderator: ModeratorWithPermissions,
    field: PermKey
  ) {
    const cellKey = `${moderator.id}:${field}`;
    const newValue = !moderator.permissions[field];

    // Optimistic update
    setModerators((prev) =>
      prev.map((m) =>
        m.id === moderator.id
          ? { ...m, permissions: { ...m.permissions, [field]: newValue } }
          : m
      )
    );

    setSavingKey(cellKey);
    const res = await setModeratorPermissionsAction(
      moderator.id,
      { [field]: newValue } as PermissionUpdate
    );
    setSavingKey(null);

    if (res.error) {
      // Rollback on error
      setModerators((prev) =>
        prev.map((m) =>
          m.id === moderator.id
            ? { ...m, permissions: { ...m.permissions, [field]: !newValue } }
            : m
        )
      );
      showToast("error", res.error);
    } else {
      const fieldLabel = PERMISSION_FIELDS.find((f) => f.key === field)?.label || field;
      showToast(
        "success",
        `${moderator.name} — ${fieldLabel} ${newValue ? "granted" : "revoked"}.`
      );
    }
  }

  // Grant ALL permissions for a moderator
  async function handleGrantAll(moderator: ModeratorWithPermissions) {
    const allTrue: PermissionUpdate = {};
    for (const f of PERMISSION_FIELDS) {
      allTrue[f.key] = true;
    }

    setModerators((prev) =>
      prev.map((m) =>
        m.id === moderator.id
          ? { ...m, permissions: { ...m.permissions, ...allTrue } }
          : m
      )
    );

    const res = await setModeratorPermissionsAction(moderator.id, allTrue);
    if (res.error) {
      showToast("error", res.error);
      loadData();
    } else {
      showToast("success", `Granted full access permissions to ${moderator.name}.`);
    }
  }

  // Revoke ALL permissions for a moderator
  async function handleRevokeAll(moderator: ModeratorWithPermissions) {
    const allFalse: PermissionUpdate = {};
    for (const f of PERMISSION_FIELDS) {
      allFalse[f.key] = false;
    }

    setModerators((prev) =>
      prev.map((m) =>
        m.id === moderator.id
          ? { ...m, permissions: { ...m.permissions, ...allFalse } }
          : m
      )
    );

    const res = await setModeratorPermissionsAction(moderator.id, allFalse);
    if (res.error) {
      showToast("error", res.error);
      loadData();
    } else {
      showToast("info", `Revoked all permissions from ${moderator.name}.`);
    }
  }

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<PermissionFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      accessLevel: "all",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <PermissionsToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <PermissionsHeader
        totalCount={moderators.length}
        loading={loading}
        onRefresh={loadData}
      />

      {/* KPI Insight Metric Cards */}
      <PermissionsInsightCards
        insights={insights}
        activeFilter={filters.accessLevel}
        onSelectFilter={(filter: PermissionAccessFilter) => {
          handleFilterChange({
            accessLevel: filters.accessLevel === filter ? "all" : filter,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <PermissionsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Interactive Permissions Matrix Table */}
      <PermissionsMatrixTable
        moderators={filteredModerators}
        loading={loading}
        savingKey={savingKey}
        onToggle={handleToggle}
        onGrantAll={handleGrantAll}
        onRevokeAll={handleRevokeAll}
        onView={(m) => setViewingModerator(m)}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* View Moderator Scope Modal */}
      {viewingModerator && (
        <ModeratorViewModal
          moderator={viewingModerator}
          onClose={() => setViewingModerator(null)}
        />
      )}
    </div>
  );
}
