import { Metadata } from "next";
import { AdminSubjectsPage } from "@/features/dashboard/components/AdminSubjectsPage";

export const metadata: Metadata = { title: "Subjects | BookLife Admin" };

export default function DashboardSubjectsPage() {
  return <AdminSubjectsPage />;
}
