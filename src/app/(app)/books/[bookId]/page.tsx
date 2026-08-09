import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { books, authors, publishers, subjects, reviews } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { BookDetailView } from "@/features/books/components/BookDetailView";

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { bookId } = await params;
  try {
    const [book] = await db
      .select({ name: books.name })
      .from(books)
      .where(eq(books.id, bookId));
    return {
      title: book ? `${book.name} | BookLife` : "বই | BookLife",
      description: book ? `${book.name} — BookLife-এ কিনুন` : "",
    };
  } catch {
    return { title: "বই | BookLife" };
  }
}

export const revalidate = 60;

export default async function BookDetailPage({ params }: BookPageProps) {
  const { bookId } = await params;

  // 1. Fetch the book
  const [book] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.isActive, true)));

  if (!book) notFound();

  // 2. Fetch author, publisher, subject in parallel
  const [authorRow, publisherRow, subjectRow] = await Promise.all([
    book.authorId
      ? db
        .select({ id: authors.id, name: authors.name })
        .from(authors)
        .where(eq(authors.id, book.authorId))
        .then((r) => r[0] ?? null)
      : null,
    book.publisherId
      ? db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .where(eq(publishers.id, book.publisherId))
        .then((r) => r[0] ?? null)
      : null,
    book.subjectId
      ? db
        .select({ id: subjects.id, title: subjects.title, slug: subjects.slug })
        .from(subjects)
        .where(eq(subjects.id, book.subjectId))
        .then((r) => r[0] ?? null)
      : null,
  ]);

  // 3. Fetch visible reviews for this book
  const bookReviews = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.bookId, bookId), eq(reviews.isHidden, false)))
    .orderBy(desc(reviews.createdAt))
    .limit(20);

  // 4. Fetch related books (same subject, different book)
  const relatedRows = book.subjectId
    ? await db
      .select({
        id: books.id,
        name: books.name,
        imageUrl: books.imageUrl,
        pricePaisa: books.pricePaisa,
        discountPricePaisa: books.discountPricePaisa,
        authorId: books.authorId,
      })
      .from(books)
      .where(
        and(
          eq(books.subjectId, book.subjectId),
          eq(books.isActive, true),
        ),
      )
      .orderBy(desc(books.createdAt))
      .limit(6)
    : [];

  // Fetch names for related book authors
  const relatedAuthorIds = [
    ...new Set(relatedRows.map((r) => r.authorId).filter((id): id is string => !!id)),
  ];
  const relatedAuthors = relatedAuthorIds.length
    ? await db
      .select({ id: authors.id, name: authors.name })
      .from(authors)
      .where(inArray(authors.id, relatedAuthorIds))
    : [];
  const relatedAuthorMap = new Map(relatedAuthors.map((a) => [a.id, a.name]));

  const price = Math.round(book.pricePaisa / 100);
  const discountPrice = book.discountPricePaisa
    ? Math.round(book.discountPricePaisa / 100)
    : null;
  const discountPct =
    discountPrice && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

  // Average rating
  const avgRating =
    bookReviews.length > 0
      ? bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length
      : 0;

  const starDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: bookReviews.filter((r) => r.rating === star).length,
  }));

  return (
    <BookDetailView
      book={{
        id: book.id,
        name: book.name,
        description: book.description ?? "",
        imageUrl: book.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
        pricePaisa: book.pricePaisa,
        discountPricePaisa: book.discountPricePaisa,
        price,
        discountPrice,
        discountPct,
        totalPages: book.totalPages,
        edition: book.edition,
        language: book.language,
        format: book.format,
        stock: book.stock,
      }}
      author={authorRow}
      publisher={publisherRow}
      subject={subjectRow}
      reviews={bookReviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment ?? "",
        userId: r.userId,
        createdAt: r.createdAt.toISOString(),
      }))}
      avgRating={avgRating}
      starDistribution={starDistribution}
      relatedBooks={relatedRows.map((r) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
        pricePaisa: r.pricePaisa,
        discountPricePaisa: r.discountPricePaisa,
        authorName: relatedAuthorMap.get(r.authorId ?? "") ?? "",
      }))}
    />
  );
}
