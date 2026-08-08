"use client";

import { BookImage } from "./BookImage";
import { BookMeta } from "./BookMeta";
import { BookCTA } from "./BookCTA";

export function BookHero() {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <BookImage />
        <div className="flex-1 space-y-3">
          <BookMeta />
          <BookCTA />
        </div>
      </div>
    </div>
  );
}
