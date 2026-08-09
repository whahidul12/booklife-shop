import React from "react";
import { Search } from "lucide-react";
import { toBengaliNumber } from "@/utils/formatters";

interface DirectoryHeaderProps {
  title: string;
  totalItems: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({
  title,
  totalItems,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
          {toBengaliNumber(totalItems)}
        </span>
      </div>

      {/* Search input */}
      <div className="relative w-full max-w-sm">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`${title} খুঁজুন…`}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white py-2 pr-10 pl-4 text-sm text-gray-700 shadow-xs transition-colors outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        />
        <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};
