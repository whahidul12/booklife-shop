
import { db } from "@/lib/db";
import { subjects, books } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { CategoryCarousel } from "./CategoryCarousel";
import type { CategoryItem } from "@/features/carousel/constants/carousel.const";

// Revalidate every 5 minutes
export const revalidate = 300;

export async function CategoryCarouselServer() {
  try {
    // Fetch active subjects sorted by sortOrder
    const activeSubjects = await db
      .select({ id: subjects.id, title: subjects.title, slug: subjects.slug })
      .from(subjects)
      .where(eq(subjects.isActive, true))
      .orderBy(asc(subjects.sortOrder), asc(subjects.title))
      .limit(12);

    if (!activeSubjects.length) {
      // No subjects in DB yet — render with static fallback
      return <CategoryCarousel />;
    }

    // For each subject fetch up to 4 books to show as the card sub-items
    const categoryItems: CategoryItem[] = await Promise.all(
      activeSubjects.map(async (subject) => {
        const subjectBooks = await db
          .select({
            name: books.name,
            imageUrl: books.imageUrl,
            id: books.id,
          })
          .from(books)
          .where(
            and(eq(books.subjectId, subject.id), eq(books.isActive, true)),
          )
          .orderBy(desc(books.createdAt))
          .limit(4);

        // Map to the [label, isbn_placeholder, imageSrc] tuple shape
        const items = subjectBooks.map(
          (b) =>
            [
              b.name,
              b.id,
              b.imageUrl ?? "/book_cover_img/book_cover_img (0).webp",
            ] as [string, string, string],
        );

        // Pad with placeholder items if fewer than 4 books exist for this subject
        while (items.length < 4) {
          items.push([
            "—",
            `placeholder-${items.length}`,
            "/book_cover_img/book_cover_img (0).webp",
          ]);
        }

        return {
          title: subject.title,
          items: items as CategoryItem["items"],
        };
      }),
    );

    return <CategoryCarousel categories={categoryItems} />;
  } catch {
    // DB unavailable — render with static mock, no crash
    return <CategoryCarousel />;
  }
}
