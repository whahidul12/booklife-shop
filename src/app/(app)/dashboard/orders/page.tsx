import { Metadata } from "next";
import { AdminOrdersPage } from "@/features/dashboard/components/AdminOrdersPage";

export const metadata: Metadata = { title: "Orders | BookLife Admin" };

export default function DashboardOrdersPage() {
  return <AdminOrdersPage />;
}
