"use client";

import { useEffect, useRef, useState } from "react";
export function useNavbarVisibility() {
  const topHeaderRef = useRef<HTMLElement>(null);
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState(true);

  useEffect(() => {
    const header = topHeaderRef.current;
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsTopHeaderVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return { topHeaderRef, isTopHeaderVisible };
}
