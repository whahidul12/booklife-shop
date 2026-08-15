import type { Book, Author, Publisher, Subject } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type SubjectRow = Pick<Subject, "id" | "title" | "slug">;

export type BookStatusFilter =
  | "all"
  | "published"
  | "inactive"
  | "draft"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export interface BookFilterState {
  search: string;
  status: BookStatusFilter;
  subjectId: string;
  authorId?: string;
  publisherId?: string;
  dateRange: DateRange | null;
  minPrice?: number;
  maxPrice?: number;
  format?: string;
  isFeatured?: boolean;
  isPreorder?: boolean;
}

export interface BookInsights {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
