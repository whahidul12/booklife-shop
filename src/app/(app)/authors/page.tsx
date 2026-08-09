import { Metadata } from "next";
import { db } from "@/lib/db";
import { authors } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DirectoryContainer } from "@/features/entity-directory/components/DirectoryContainer";
import { MOCK_AUTHORS } from "@/features/entity-directory/services/directoryService";
import type { DirectoryEntity } from "@/features/entity-directory/services/directoryService";

export const metadata: Metadata = {
  title: "লেখক - Authors | BookLife",
  description: "আমাদের ক্যাটালগের সকল লেখক ব্রাউজ করুন।",
};

export const revalidate = 300;

export default async function AuthorsPage() {
  let items: DirectoryEntity[] = MOCK_AUTHORS;

  try {
    const rows = await db
      .select({ id: authors.id, name: authors.name, imageUrl: authors.imageUrl })
      .from(authors)
      .orderBy(asc(authors.name));

    if (rows.length > 0) {
      items = rows.map((r) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.imageUrl ?? "/book_cover_img/author-placeholder.png",
      }));
    }
  } catch {
    console.log("##################################");
    console.log("/src/app/(app)/authors/page.tsx")
    console.log("##################################");
  }

  return (
    <div className="min-h-screen bg-white">
      <DirectoryContainer title="লেখক" type="author" items={items} />
    </div>
  );
}
