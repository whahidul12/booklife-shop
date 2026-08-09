import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SubjectCardProps {
  subject: { title: string; url: string };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link
      href={`/subjects/${subject.url}`}
      className="group flex min-h-17.5 cursor-pointer items-center justify-between rounded-md border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="line-clamp-2 text-[14px] font-medium text-gray-700 transition-colors group-hover:text-red-600">
        {subject.title}
      </span>
      <ChevronRight size={18} className="ml-2 shrink-0 text-gray-400" />
    </Link>
  );
}
