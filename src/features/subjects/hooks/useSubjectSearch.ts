import { useState, useMemo, useEffect } from "react";
import { getSubjects } from "../services/getSubjects";

export function useSubjectSearch() {
  const [subjects, setSubjects] = useState<{ title: string; url: string }[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectsData = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectsData();
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;

    return subjects.filter((subject) =>
      subject.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [subjects, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSubjects,
    isLoading,
  };
}
