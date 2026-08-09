
import { db } from "@/lib/db";
import { publishers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { PublisherCarousel } from "./PublisherCarousel";
import type { Publisher } from "@/types";

export const revalidate = 300;

interface PublisherCarouselServerProps {
  title?: string;
  seeAllLink?: string;
  limit?: number;
}

export async function PublisherCarouselServer({
  title = "জনপ্রিয় প্রকাশক",
  seeAllLink = "/publishers",
  limit = 20,
}: PublisherCarouselServerProps) {
  try {
    const rows = await db
      .select({
        id: publishers.id,
        name: publishers.name,
        logoUrl: publishers.logoUrl,
      })
      .from(publishers)
      .orderBy(asc(publishers.name))
      .limit(limit);

    if (!rows.length) {
      return <PublisherCarousel title={title} seeAllLink={seeAllLink} />;
    }

    const dbPublishers: Publisher[] = rows.map((r, idx) => ({
      id: idx + 1,
      name: r.name,
      logo: r.logoUrl ?? "/brand_logos/wafilife-logo.svg",
      href: `/publishers`,
    }));

    return (
      <PublisherCarousel
        title={title}
        seeAllLink={seeAllLink}
        publishers={dbPublishers}
      />
    );
  } catch {
    return <PublisherCarousel title={title} seeAllLink={seeAllLink} />;
  }
}
