import { Metadata } from "next";
import { AdminUsersPage } from "@/features/dashboard/components/AdminUsersPage";

export const metadata: Metadata = { title: "Users | BookLife Admin" };

export default function DashboardUsersPage() {
  return <AdminUsersPage />;
}
