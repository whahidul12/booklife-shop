import { Metadata } from "next";
import {
  HeroCarouselServer,
  BookCarouselServer,
  PublisherCarouselServer,
  AppPromoSection,
} from "@/components/shared";

export const metadata: Metadata = {
  title: "জেনারেল বই | BookLife",
  description: "সাধারণ বিষয়ের বই ব্রাউজ করুন।",
};

export default function GeneralBooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full py-8">
        <HeroCarouselServer />
        <BookCarouselServer
          title="ইতিহাস ও ঐতিহ্য"
          seeAllLink="/subjects/history-heritage"
          subjectSlug="history-heritage"
          limit={20}
        />
        <BookCarouselServer
          title="আত্ম-উন্নয়ন ও মোটিভেশন"
          seeAllLink="/subjects/self-development"
          subjectSlug="self-development"
          limit={20}
        />
        <BookCarouselServer
          title="উপন্যাস"
          seeAllLink="/subjects/novel"
          subjectSlug="novel"
          limit={20}
        />
        <PublisherCarouselServer title="জনপ্রিয় প্রকাশক" seeAllLink="/publishers" />
        <BookCarouselServer
          title="সীরাতে রাসূলুল্লাহ"
          seeAllLink="/subjects/sirat-biography"
          subjectSlug="sirat-biography"
          limit={20}
        />
        <AppPromoSection />
      </main>
    </div>
  );
}
