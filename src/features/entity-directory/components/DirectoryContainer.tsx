"use client";

import React from "react";
import { DirectoryHeader } from "./DirectoryHeader";
import { DirectoryGrid } from "./DirectoryGrid";
import { Pagination } from "./Pagination";
import { useDirectoryFilters } from "../hooks/useDirectoryFilters";
import type { DirectoryEntity, EntityType } from "../services/directoryService";

interface DirectoryContainerProps {
  title: string;
  type: EntityType;
  items: DirectoryEntity[];
}

export const DirectoryContainer: React.FC<DirectoryContainerProps> = ({
  title,
  type,
  items,
}) => {
  const {
    searchQuery,
    handleSearchChange,
    pageItems,
    currentPage,
    totalPages,
    totalItems,
    startLabel,
    endLabel,
    handlePageChange,
  } = useDirectoryFilters(items);

  return (
    <div className="mx-auto max-w-350 px-4 py-8">
      <DirectoryHeader
        title={title}
        totalItems={totalItems}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Empty state */}
      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-base font-medium text-gray-500">
            &ldquo;{searchQuery}&rdquo; এর জন্য কোনো ফলাফল পাওয়া যায়নি
          </p>
          <p className="mt-1 text-sm text-gray-400">
            অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন
          </p>
        </div>
      ) : (
        <>
          <DirectoryGrid items={pageItems} type={type} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startLabel={startLabel}
            endLabel={endLabel}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
