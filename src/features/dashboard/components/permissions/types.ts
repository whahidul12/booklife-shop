import type { ModeratorWithPermissions } from "@/features/permissions/actions/permissions.actions";
import type { ModeratorPermission } from "@/db/schema";

export type PermKey = keyof Omit<ModeratorPermission, "userId" | "updatedAt" | "updatedBy">;

export type PermissionAccessFilter = "all" | "full" | "partial" | "none";

export interface PermissionFilterState {
  search: string;
  accessLevel: PermissionAccessFilter;
}

export interface PermissionInsights {
  totalModerators: number;
  fullAccess: number;
  partialAccess: number;
  noAccess: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
