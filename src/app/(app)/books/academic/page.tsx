import { Metadata } from "next";
import {
  HeroCarouselServer,
  BookCarouselServer,
  PublisherCarouselServer,
  AppPromoSection,
} from "@/components/shared";

export const metadata: Metadata = {
  title: "একাডেমিক বই | BookLife",
  description: "একাডেমিক ও শিক্ষামূলক বই ব্রাউজ করুন।",
};

export default function AcademicBooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full py-8">
        <HeroCarouselServer />
        <BookCarouselServer
          title="একাডেমিক বই"
          seeAllLink="/subjects/academic"
          subjectSlug="academic"
          limit={20}
        />
        <BookCarouselServer
          title="বিজ্ঞান ও প্রযুক্তি"
          seeAllLink="/subjects/science-technology"
          subjectSlug="science-technology"
          limit={20}
        />
        <BookCarouselServer
          title="শিশু-কিশোর বই"
          seeAllLink="/subjects/children-books"
          subjectSlug="children-books"
          limit={20}
        />
        <PublisherCarouselServer title="জনপ্রিয় প্রকাশক" seeAllLink="/publishers" />
        <BookCarouselServer
          title="ছড়া ও কবিতা"
          seeAllLink="/subjects/poetry"
          subjectSlug="poetry"
          limit={20}
        />
        <AppPromoSection />
      </main>
    </div>
  );
}
