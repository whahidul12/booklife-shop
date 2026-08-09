/**
 * Publishers directory page — RSC.
 * Fetches real publishers from Neon DB and passes them to the existing
 * DirectoryContainer (which handles client-side search + pagination).
 * Falls back to MOCK_PUBLISHERS if DB is empty or unavailable.
 */
import { Metadata } from "next";
import { db } from "@/lib/db";
import { publishers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DirectoryContainer } from "@/features/entity-directory/components/DirectoryContainer";
import { MOCK_PUBLISHERS } from "@/features/entity-directory/services/directoryService";
import type { DirectoryEntity } from "@/features/entity-directory/services/directoryService";

export const metadata: Metadata = {
  title: "প্রকাশক - Publishers | BookLife",
  description: "আমাদের ক্যাটালগের সকল প্রকাশনী ব্রাউজ করুন।",
};

export const revalidate = 300;

export default async function PublishersPage() {
  let items: DirectoryEntity[] = MOCK_PUBLISHERS;

  try {
    const rows = await db
      .select({ id: publishers.id, name: publishers.name, logoUrl: publishers.logoUrl })
      .from(publishers)
      .orderBy(asc(publishers.name));

    if (rows.length > 0) {
      items = rows.map((r) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.logoUrl ?? "/book_cover_img/author-placeholder.png",
      }));
    }
  } catch {
    console.log("##################################");
    console.log("\src\app\(app)\publishers\page.tsx")
    console.log("##################################");
  }

  return (
    <div className="min-h-screen bg-white">
      <DirectoryContainer title="প্রকাশক" type="publisher" items={items} />
    </div>
  );
}
