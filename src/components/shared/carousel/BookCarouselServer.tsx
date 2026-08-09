import { db } from "@/lib/db";
import { books, authors, subjects } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { BookCarousel } from "./BookCarousel";
import type { Book as BookType } from "@/types";

export const revalidate = 120;

interface BookCarouselServerProps {
  title?: string;
  seeAllLink?: string;
  /** DB subject slug — e.g. "islamic-books" */
  subjectSlug?: string;
  featured?: boolean;
  preorder?: boolean;
  limit?: number;
}

export async function BookCarouselServer({
  title = "নতুন প্রকাশিত বই",
  seeAllLink = "#",
  subjectSlug,
  featured,
  preorder,
  limit = 20,
}: BookCarouselServerProps) {
  try {
    // Build where conditions
    const conditions = [eq(books.isActive, true)];

    if (featured) conditions.push(eq(books.isFeatured, true));
    if (preorder) conditions.push(eq(books.isPreorder, true));

    if (subjectSlug) {
      const [subject] = await db
        .select({ id: subjects.id })
        .from(subjects)
        .where(eq(subjects.slug, subjectSlug));
      if (subject) conditions.push(eq(books.subjectId, subject.id));
    }

    const rows = await db
      .select({
        id: books.id,
        name: books.name,
        imageUrl: books.imageUrl,
        pricePaisa: books.pricePaisa,
        discountPricePaisa: books.discountPricePaisa,
        authorId: books.authorId,
      })
      .from(books)
      .where(and(...conditions))
      .orderBy(desc(books.createdAt))
      .limit(limit);

    if (!rows.length) {
      return <BookCarousel title={title} seeAllLink={seeAllLink} />;
    }

    // Batch-fetch author names
    const authorIds = [
      ...new Set(rows.map((r) => r.authorId).filter((id): id is string => !!id)),
    ];

    const authorRows = authorIds.length
      ? await db
        .select({ id: authors.id, name: authors.name })
        .from(authors)
        .where(inArray(authors.id, authorIds))
      : [];

    const authorMap = new Map(authorRows.map((a) => [a.id, a.name]));

    // Map to the legacy Book shape + attach dbId for real link href
    const dbBooks = rows.map((row, idx) => {
      const price = Math.round(row.pricePaisa / 100);
      const discountPrice = row.discountPricePaisa
        ? Math.round(row.discountPricePaisa / 100)
        : null;
      const discountPct =
        discountPrice && discountPrice < price
          ? Math.round(((price - discountPrice) / price) * 100)
          : null;

      return {
        id: row.id,
        dbId: row.id,
        title: row.name,
        author: authorMap.get(row.authorId ?? "") ?? "",
        price: `${discountPrice ?? price}৳`,
        oldPrice: discountPrice ? `${price}৳` : undefined,
        discount: discountPct ? String(discountPct) : undefined,
        image: row.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
      } as BookType & { dbId: string };
    });

    return (
      <BookCarousel title={title} seeAllLink={seeAllLink} books={dbBooks} />
    );
  } catch {
    return <BookCarousel title={title} seeAllLink={seeAllLink} />;
  }
}
