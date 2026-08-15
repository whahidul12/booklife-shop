import type { Publisher } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type PublisherLogoFilter = "all" | "has_logo" | "no_logo";

export interface PublisherFilterState {
  search: string;
  logoStatus: PublisherLogoFilter;
  dateRange: DateRange | null;
}

export interface PublisherInsights {
  total: number;
  withLogo: number;
  withoutLogo: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
