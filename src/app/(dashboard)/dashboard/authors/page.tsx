import { Metadata } from "next";
import { AdminAuthorsPage } from "@/features/dashboard/components/AdminAuthorsPage";

export const metadata: Metadata = { title: "Authors | BookLife Admin" };

export default function DashboardAuthorsPage() {
  return <AdminAuthorsPage />;
}
