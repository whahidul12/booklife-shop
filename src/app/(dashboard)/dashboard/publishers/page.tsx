import { Metadata } from "next";
import { AdminPublishersPage } from "@/features/dashboard/components/AdminPublishersPage";

export const metadata: Metadata = { title: "Publishers | BookLife Admin" };

export default function DashboardPublishersPage() {
  return <AdminPublishersPage />;
}
