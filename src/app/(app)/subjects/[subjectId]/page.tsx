import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { subjects, books, authors } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { BookListContainer } from "@/components/shared/books/BookListContainer";

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>;
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { subjectId } = await params;
  try {
    const [subject] = await db
      .select({ title: subjects.title })
      .from(subjects)
      .where(eq(subjects.slug, subjectId));
    return {
      title: subject
        ? `${subject.title} | BookLife`
        : "বইয়ের তালিকা | BookLife",
      description: subject
        ? `${subject.title} বিষয়ের সকল বই ব্রাউজ করুন`
        : "বইয়ের তালিকা",
    };
  } catch {
    return { title: "বইয়ের তালিকা | BookLife" };
  }
}

export const revalidate = 120;

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { subjectId: slug } = await params;

  // 1. Resolve slug → subject
  const [subject] = await db
    .select({ id: subjects.id, title: subjects.title, slug: subjects.slug })
    .from(subjects)
    .where(and(eq(subjects.slug, slug), eq(subjects.isActive, true)));

  if (!subject) {
    notFound();
  }

  // 2. Fetch books for this subject
  const bookRows = await db
    .select({
      id: books.id,
      name: books.name,
      pricePaisa: books.pricePaisa,
      discountPricePaisa: books.discountPricePaisa,
      imageUrl: books.imageUrl,
      authorId: books.authorId,
    })
    .from(books)
    .where(and(eq(books.subjectId, subject.id), eq(books.isActive, true)))
    .orderBy(desc(books.createdAt))
    .limit(100);

  // 3. Batch-fetch author names
  const authorIds = [
    ...new Set(
      bookRows.map((b) => b.authorId).filter((id): id is string => !!id),
    ),
  ];
  const authorRows = authorIds.length
    ? await db
      .select({ id: authors.id, name: authors.name })
      .from(authors)
      .where(inArray(authors.id, authorIds))
    : [];
  const authorMap = new Map(authorRows.map((a) => [a.id, a.name]));

  // 4. Shape for BookListContainer
  const initialBooks = bookRows.map((b) => ({
    id: b.id,
    name: b.name,
    pricePaisa: b.pricePaisa,
    discountPricePaisa: b.discountPricePaisa,
    imageUrl: b.imageUrl,
    authorName: authorMap.get(b.authorId ?? "") ?? "",
  }));

  return (
    <BookListContainer
      initialBooks={initialBooks}
      subjectTitle={subject.title}
    />
  );
}
