import { Metadata } from "next";
import {
  HeroCarouselServer,
  BookCarouselServer,
  AppPromoSection,
} from "@/components/shared";

export const metadata: Metadata = {
  title: "প্রি-অর্ডার | BookLife",
  description: "সর্বশেষ প্রি-অর্ডার বই দেখুন।",
};

export default function PreorderPage() {
  return (
    <main className="mx-auto w-full py-8">
      <HeroCarouselServer />
      <BookCarouselServer
        title="প্রি-অর্ডার বই"
        seeAllLink="/preorder"
        preorder
        limit={20}
      />
      <AppPromoSection />
    </main>
  );
}
