import { Metadata } from "next";
import { PromoGallerySection } from "@/features/promo-gallery/components/PromoGallerySection";
import { AuthorCarousel } from "@/components/shared/carousel/AuthorCarousel";
import { AppPromoSection } from "@/components/shared";

export const metadata: Metadata = {
  title: "নতুন প্রকাশিত বই - New Releases | Wafilife",
  description: "Browse the latest new book releases.",
};

export default function NewReleasesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PromoGallerySection />
      <AuthorCarousel />
      <AppPromoSection />
    </div>
  );
}
