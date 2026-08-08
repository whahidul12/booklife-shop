import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookListHeaderProps {
  totalResults: number;
  startIndex: number;
  endIndex: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export const BookListHeader: React.FC<BookListHeaderProps> = ({
  totalResults,
  startIndex,
  endIndex,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between border-b border-gray-200 pb-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-900">নতুন প্রকাশিত বই</h1>
        <p className="mt-1 text-sm text-gray-500">
          {startIndex} - {endIndex} of {totalResults} results
        </p>
      </div>

      <div className="mt-4 flex items-center space-x-2 sm:mt-0">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select
          value={sortBy}
          onValueChange={(val) => val && onSortChange(val)}
        >
          <SelectTrigger className="h-9 w-45 bg-white text-sm">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new_published">New Published</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
