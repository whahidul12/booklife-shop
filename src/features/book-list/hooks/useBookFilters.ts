import { useState, useMemo } from "react";
import { parseBengaliNumber } from "@/utils/formatters";
import { Book } from "@/types/book"; // Ensure this matches your Book type path

export const useBookFilters = (initialBooks: Book[] = []) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>("");

  const filteredAndSortedBooks = useMemo(() => {
    let list = [...initialBooks];

    // Filter by price range
    list = list.filter((book) => {
      const price = parseBengaliNumber(book.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort by selected option
    if (sortBy === "price_low") {
      list.sort(
        (a, b) => parseBengaliNumber(a.price) - parseBengaliNumber(b.price),
      );
    } else if (sortBy === "price_high") {
      list.sort(
        (a, b) => parseBengaliNumber(b.price) - parseBengaliNumber(a.price),
      );
    } else if (sortBy === "new_published") {
      list.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return list;
  }, [initialBooks, priceRange, sortBy]);

  return {
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    filteredBooks: filteredAndSortedBooks,
  };
};
