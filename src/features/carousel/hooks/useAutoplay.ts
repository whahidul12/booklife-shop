"use client";

import { useCallback, useEffect, useState } from "react";

export function useAutoplay(length: number, interval = 4000) {
  const [active, setActive] = useState(0);

  const move = useCallback(
    (direction: number) => {
      setActive((current) => (current + direction + length) % length);
    },
    [length],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      move(1);
    }, interval);
    return () => window.clearInterval(timer);
  }, [move, interval]);

  return { active, move, setActive };
}
