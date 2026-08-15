import { Metadata } from "next";
import { AdminBannersPage } from "@/features/dashboard/components/AdminBannersPage";

export const metadata: Metadata = { title: "Banners | BookLife Admin" };

export default function DashboardBannersPage() {
  return <AdminBannersPage />;
}
