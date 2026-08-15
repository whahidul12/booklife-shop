import { Metadata } from "next";
import { AdminBooksPage } from "@/features/dashboard/components/AdminBooksPage";

export const metadata: Metadata = { title: "Books | BookLife Admin" };

export default function DashboardBooksPage() {
  return <AdminBooksPage />;
}
