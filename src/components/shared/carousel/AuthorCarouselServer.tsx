
import { db } from "@/lib/db";
import { authors } from "@/db/schema";
import { asc } from "drizzle-orm";
import { AuthorCarousel } from "./AuthorCarousel";
import type { Author } from "@/types";

export const revalidate = 300;

interface AuthorCarouselServerProps {
  title?: string;
  seeAllLink?: string;
  limit?: number;
}

export async function AuthorCarouselServer({
  title = "জনপ্রিয় লেখক",
  seeAllLink = "/authors",
  limit = 20,
}: AuthorCarouselServerProps) {
  try {
    const rows = await db
      .select({ id: authors.id, name: authors.name, imageUrl: authors.imageUrl })
      .from(authors)
      .orderBy(asc(authors.name))
      .limit(limit);

    if (!rows.length) {
      return <AuthorCarousel title={title} seeAllLink={seeAllLink} />;
    }

    const dbAuthors: Author[] = rows.map((r, idx) => ({
      id: idx + 1,
      name: r.name,
      avatar: r.imageUrl ?? "/book_cover_img/author-placeholder.png",
      href: `/authors`,
    }));

    return (
      <AuthorCarousel
        title={title}
        seeAllLink={seeAllLink}
        authors={dbAuthors}
      />
    );
  } catch {
    return <AuthorCarousel title={title} seeAllLink={seeAllLink} />;
  }
}
