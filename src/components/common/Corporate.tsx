import {
  HeroSection,
  QuoteSection,
  SectorsSection,
  WhyUsSection,
} from "@/features/corporate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "নতুন প্রকাশিত বই - New Releases | Wafilife",
  description: "Browse the latest new book releases.",
};

export default function Corporate() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhyUsSection />
      <SectorsSection />
      <QuoteSection />
    </div>
  );
}
