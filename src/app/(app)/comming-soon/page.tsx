import { ComingSoonContent } from "@/components/common/ComingSoonContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "শীঘ্রই আসছে | WafiLife",
  description: "এই পাতাটি শীঘ্রই চালু হবে। আমাদের সাথেই থাকুন।",
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ComingSoonContent />
    </div>
  );
}
