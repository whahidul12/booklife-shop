import type { DateRange } from "../overview/DateRangePicker";

export type Role = "admin" | "moderator" | "customer";
export type UserRoleFilter = "all" | Role;
export type UserStatusFilter = "all" | "active" | "banned";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  image?: string | null;
  createdAt: Date | string;
};

export interface UserFilterState {
  search: string;
  role: UserRoleFilter;
  status: UserStatusFilter;
  dateRange: DateRange | null;
}

export interface UserInsights {
  total: number;
  customers: number;
  moderators: number;
  admins: number;
  banned: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
