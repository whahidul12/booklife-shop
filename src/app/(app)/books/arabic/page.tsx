import { Metadata } from "next";
import {
  HeroCarouselServer,
  BookCarouselServer,
  PublisherCarouselServer,
  AppPromoSection,
} from "@/components/shared";

export const metadata: Metadata = {
  title: "আরবি বই | BookLife",
  description: "আরবি ভাষার বই ও ইসলামি সাহিত্য ব্রাউজ করুন।",
};

export default function ArabicBooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full py-8">
        <HeroCarouselServer />
        <BookCarouselServer
          title="আরবি ভাষা শিক্ষা"
          seeAllLink="/subjects/arabic-language"
          subjectSlug="arabic-language"
          limit={20}
        />
        <BookCarouselServer
          title="কুরআন ও তাফসির"
          seeAllLink="/subjects/quran-tafsir"
          subjectSlug="quran-tafsir"
          limit={20}
        />
        <BookCarouselServer
          title="হাদিস"
          seeAllLink="/subjects/hadith"
          subjectSlug="hadith"
          limit={20}
        />
        <PublisherCarouselServer title="জনপ্রিয় প্রকাশক" seeAllLink="/publishers" />
        <BookCarouselServer
          title="ইসলামি ইতিহাস"
          seeAllLink="/subjects/islamic-history"
          subjectSlug="islamic-history"
          limit={20}
        />
        <BookCarouselServer
          title="দর্শন ও চিন্তা"
          seeAllLink="/subjects/philosophy"
          subjectSlug="philosophy"
          limit={20}
        />
        <AppPromoSection />
      </main>
    </div>
  );
}
