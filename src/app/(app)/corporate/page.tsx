import Corporate from "@/components/common/Corporate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "নতুন প্রকাশিত বই - New Releases | Wafilife",
  description: "Browse the latest new book releases.",
};

export default function NewReleasesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Corporate />
    </div>
  );
}
