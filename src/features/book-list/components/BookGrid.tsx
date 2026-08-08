import React from "react";
import { BookCard } from "./BookCard";

export interface BookItem {
  id: string | number;
  title: string;
  author: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
}

interface BookGridProps {
  books: BookItem[];
  isLoading?: boolean;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-80 w-full animate-pulse rounded-md bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex min-h-75 w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
        <p className="text-sm">কোনো বই পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={typeof book.id === "string" ? parseInt(book.id, 10) || 0 : book.id}
          title={book.title}
          author={book.author}
          price={`${book.currentPrice}৳`}
          oldPrice={book.originalPrice > book.currentPrice ? `${book.originalPrice}৳` : undefined}
          discount={book.discountPercentage > 0 ? `${book.discountPercentage}%` : undefined}
          image={book.imageUrl}
        />
      ))}
    </div>
  );
};
