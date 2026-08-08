import type { BookItem } from "../components/BookGrid";

export const fetchBooks = async (): Promise<BookItem[]> => {
  // Replace with actual backend endpoint when ready
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `book-${i + 1}`,
    title: "সীরাতুন নবী (সাঃ)",
    author: "ইবনে হিশাম",
    currentPrice: 350,
    originalPrice: 500,
    discountPercentage: 30,
    imageUrl: "/book_cover_img/book_cover_img.webp",
  }));
};
