import type { Review } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type ReviewStatusFilter = "all" | "visible" | "hidden";

export type ReviewRatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export interface ReviewFilterState {
  search: string;
  status: ReviewStatusFilter;
  rating: ReviewRatingFilter;
  dateRange: DateRange | null;
}

export interface ReviewInsights {
  total: number;
  avgRating: number;
  visibleCount: number;
  hiddenCount: number;
  fiveStarCount: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
