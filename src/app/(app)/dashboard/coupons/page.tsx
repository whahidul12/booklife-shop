import { Metadata } from "next";
import { AdminCouponsPage } from "@/features/dashboard/components/AdminCouponsPage";

export const metadata: Metadata = { title: "Coupons | BookLife Admin" };

export default function DashboardCouponsPage() {
  return <AdminCouponsPage />;
}
