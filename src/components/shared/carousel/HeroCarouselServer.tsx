
import { db } from "@/lib/db";
import { banners as bannersTable } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { HeroCarousel } from "./HeroCarousel";
import type { Banner } from "@/features/carousel/constants/carousel.const";

// Revalidate every 5 minutes — banners don't change often
export const revalidate = 300;

export async function HeroCarouselServer() {
  try {
    const rows = await db
      .select({
        id: bannersTable.id,
        imageUrl: bannersTable.imageUrl,
        title: bannersTable.title,
        linkUrl: bannersTable.linkUrl,
      })
      .from(bannersTable)
      .where(
        and(eq(bannersTable.type, "hero"), eq(bannersTable.isActive, true)),
      )
      .orderBy(asc(bannersTable.sortOrder));

    if (!rows.length) {
      // DB empty — fall back to static banners
      return <HeroCarousel />;
    }

    const bannerData: Banner[] = rows.map((row) => ({
      image: row.imageUrl,
      title: row.title ?? "",
    }));

    return <HeroCarousel banners={bannerData} />;
  } catch {
    // DB unavailable — fall back to static banners without crashing
    return <HeroCarousel />;
  }
}
