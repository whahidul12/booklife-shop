import {
  HeroCarouselServer,
  CategoryCarouselServer,
  BookCarouselServer,
  AuthorCarouselServer,
  PublisherCarouselServer,
  AppPromoSection,
} from "@/components/shared";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full py-8">
        {/* Hero banners from DB */}
        <HeroCarouselServer />

        {/* Category carousel — subjects + their books from DB */}
        <CategoryCarouselServer />

        {/* New arrivals — latest books */}
        <BookCarouselServer
          title="নতুন প্রকাশিত বই"
          seeAllLink="/subjects"
          limit={20}
        />

        {/* Featured / trending */}
        <BookCarouselServer
          title="ট্রেন্ডিং বই"
          seeAllLink="/subjects"
          featured
          limit={20}
        />

        {/* Pre-orders */}
        <BookCarouselServer
          title="প্রি-অর্ডার"
          seeAllLink="/preorder"
          preorder
          limit={20}
        />

        {/* Second category carousel */}
        <CategoryCarouselServer />

        {/* Authors carousel */}
        <AuthorCarouselServer title="জনপ্রিয় লেখক" seeAllLink="/authors" />

        {/* Subject-specific carousels */}
        <BookCarouselServer
          title="কুরআনের তরজমা ও তাফসীর"
          seeAllLink="/subjects/quran-tafsir"
          subjectSlug="quran-tafsir"
          limit={20}
        />

        <BookCarouselServer
          title="সীরাতে রাসূলুল্লাহ"
          seeAllLink="/subjects/sirat-biography"
          subjectSlug="sirat-biography"
          limit={20}
        />

        {/* Publishers carousel */}
        <PublisherCarouselServer
          title="জনপ্রিয় প্রকাশক"
          seeAllLink="/publishers"
        />

        <BookCarouselServer
          title="আল হাদিস"
          seeAllLink="/subjects/hadith"
          subjectSlug="hadith"
          limit={20}
        />

        <BookCarouselServer
          title="ইতিহাস ও ঐতিহ্য"
          seeAllLink="/subjects/islamic-history"
          subjectSlug="islamic-history"
          limit={20}
        />

        <BookCarouselServer
          title="ইসলামি বই"
          seeAllLink="/subjects/islamic-books"
          subjectSlug="islamic-books"
          limit={20}
        />

        <BookCarouselServer
          title="শিশু-কিশোরদের বই"
          seeAllLink="/subjects/children-books"
          subjectSlug="children-books"
          limit={20}
        />

        <AppPromoSection />
      </main>
    </>
  );
}
