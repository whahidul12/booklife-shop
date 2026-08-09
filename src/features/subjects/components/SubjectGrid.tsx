import { SubjectCard } from "./SubjectCard";

interface SubjectGridProps {
  subjects: { title: string; url: string }[];
  isLoading: boolean;
}

export function SubjectGrid({ subjects, isLoading }: SubjectGridProps) {
  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">লোড হচ্ছে...</div>;
  }

  if (subjects.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        কোন বিষয় পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {subjects.map((subject, idx) => (
        <SubjectCard key={idx} subject={subject} />
      ))}
    </div>
  );
}
