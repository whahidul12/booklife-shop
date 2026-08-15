import type { Coupon } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type CouponStatusFilter = "all" | "active" | "inactive" | "expired" | "maxed";

export interface CouponFilterState {
  search: string;
  status: CouponStatusFilter;
  dateRange: DateRange | null;
}

export interface CouponInsights {
  total: number;
  activeCount: number;
  totalUses: number;
  expiredCount: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
