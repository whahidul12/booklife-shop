"use client";

/**
 * Client wrapper for the subjects page.
 * Receives the full subjects list from the RSC (already fetched from DB),
 * then handles client-side filtering — no extra network round-trip needed.
 */
import { useState, useMemo } from "react";
import { SubjectHeader } from "./SubjectHeader";
import { SubjectGrid } from "./SubjectGrid";

interface SubjectItem {
  id: string;
  title: string;
  slug: string;
}

interface SubjectSearchClientProps {
  subjects: SubjectItem[];
}

export function SubjectSearchClient({ subjects }: SubjectSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter((s) => s.title.toLowerCase().includes(q));
  }, [subjects, searchQuery]);

  return (
    <>
      <SubjectHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <SubjectGrid
        subjects={filteredSubjects.map((s) => ({ title: s.title, url: s.slug }))}
        isLoading={false}
      />
    </>
  );
}
