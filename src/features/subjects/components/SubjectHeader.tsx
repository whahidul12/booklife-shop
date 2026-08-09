import { Search } from "lucide-react";

interface SubjectHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SubjectHeader({
  searchQuery,
  onSearchChange,
}: SubjectHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">বিষয় সমূহ</h1>

      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="বইয়ের নাম ও লেখক দিয়ে অনুসন্ধান করুন"
          className="w-full rounded-md border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none"
        />
        <Search
          size={18}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
