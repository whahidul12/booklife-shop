import type { Author } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type AuthorPhotoFilter = "all" | "has_photo" | "no_photo";

export interface AuthorFilterState {
  search: string;
  photoStatus: AuthorPhotoFilter;
  hasBio?: boolean;
  dateRange: DateRange | null;
}

export interface AuthorInsights {
  total: number;
  withPhoto: number;
  withBio: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
