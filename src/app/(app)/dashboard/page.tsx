import { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";

export const metadata: Metadata = { title: "Dashboard | BookLife Admin" };

export default function DashboardPage() {
  return <DashboardOverview />;
}
