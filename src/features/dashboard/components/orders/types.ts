import type { Order, OrderItem } from "@/db/schema";
import type { DateRange } from "../overview/DateRangePicker";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type OrderStatusFilter = "all" | OrderStatus;
export type PaymentMethodFilter = "all" | "cash_on_delivery" | "bkash" | "card" | "sslcommerz";

export interface OrderFilterState {
  search: string;
  status: OrderStatusFilter;
  paymentMethod: PaymentMethodFilter;
  dateRange: DateRange | null;
}

export interface OrderInsights {
  total: number;
  pendingCount: number;
  shippedCount: number;
  deliveredCount: number;
  totalRevenuePaisa: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
