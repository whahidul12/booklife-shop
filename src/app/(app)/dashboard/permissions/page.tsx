import { Metadata } from "next";
import { AdminPermissionsPage } from "@/features/dashboard/components/AdminPermissionsPage";

export const metadata: Metadata = {
  title: "Permissions | BookLife Admin",
};

export default function DashboardPermissionsPage() {
  return <AdminPermissionsPage />;
}
