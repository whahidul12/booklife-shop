import type { Banner } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type BannerTypeFilter = "all" | "hero" | "category";
export type BannerStatusFilter = "all" | "active" | "inactive";

export interface BannerFilterState {
  search: string;
  type: BannerTypeFilter;
  status: BannerStatusFilter;
  dateRange: DateRange | null;
}

export interface BannerInsights {
  total: number;
  activeCount: number;
  heroCount: number;
  categoryCount: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
