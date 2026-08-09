
import { Metadata } from "next";
import { getActiveSubjectsAction } from "@/features/subjects/actions/subjects.actions";
import { SubjectSearchClient } from "@/features/subjects/components/SubjectSearchClient";
import { SUBJECTS_DATA } from "@/features/subjects/constants/constants";

export const metadata: Metadata = {
  title: "বিষয় সমূহ | BookLife",
  description: "সকল বিষয় ও ক্যাটাগরি ব্রাউজ করুন",
};

// Revalidate every 60 seconds so new subjects appear without a deploy
export const revalidate = 60;

export default async function SubjectsPage() {
  // Fetch live subjects from DB; fall back to static data if DB is not yet configured
  const result = await getActiveSubjectsAction();

  const subjects = result.data?.length
    ? result.data
    : SUBJECTS_DATA.map((s, i) => ({ id: `static-${i}`, title: s.title, slug: s.url }));

  return (
    <main className="mx-auto min-h-screen max-w-360 bg-[#FDFDFD] px-4 py-8 md:px-8 lg:px-12">
      <SubjectSearchClient subjects={subjects} />
    </main>
  );
}
