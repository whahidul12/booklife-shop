import type { Subject } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type SubjectStatusFilter = "all" | "active" | "inactive";

export interface SubjectFilterState {
  search: string;
  status: SubjectStatusFilter;
  dateRange: DateRange | null;
}

export interface SubjectInsights {
  total: number;
  activeCount: number;
  inactiveCount: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
