import { getPromoBanners } from "../services/getPromoBanners";
import { PromoCard } from "./PromoCard";

export async function PromoGallerySection() {
  const banners = await getPromoBanners();

  return (
    <section className="mx-auto w-full max-w-360 bg-white px-4 py-12 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {banners.map((banner) => (
          <PromoCard
            key={banner.id}
            src={banner.src}
            alt={banner.alt}
            link={banner.link}
          />
        ))}
      </div>
    </section>
  );
}
