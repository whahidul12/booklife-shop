import { Metadata } from "next";
import { AdminReviewsPage } from "@/features/dashboard/components/AdminReviewsPage";

export const metadata: Metadata = { title: "Reviews | BookLife Admin" };

export default function DashboardReviewsPage() {
  return <AdminReviewsPage />;
}
