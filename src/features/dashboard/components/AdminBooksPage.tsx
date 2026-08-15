"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Book, Author, Publisher } from "@/db/schema";
import { getBooksAction } from "@/features/books/actions/books.actions";
import {
  getAuthorsAction,
  getPublishersAction,
} from "@/features/books/actions/taxonomy.actions";
import { getActiveSubjectsAction } from "@/features/subjects/actions/subjects.actions";
import {
  BooksHeader,
  BooksInsightCards,
  BooksFilterBar,
  BooksTable,
  BooksPagination,
  BookViewModal,
  BookEditModal,
  BookCreateModal,
  BookDeleteModal,
  BooksToast,
  type BookFilterState,
  type BookStatusFilter,
  type BookInsights,
  type SubjectRow,
  type ToastMessage,
} from "./books";

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<BookFilterState>({
    search: "",
    status: "all",
    subjectId: "",
    dateRange: null,
    format: undefined,
    isFeatured: undefined,
    isPreorder: undefined,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Show Toast helper
  const showToast = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      setToast({
        id: Math.random().toString(36).slice(2),
        type,
        message,
      });
    },
    []
  );

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, aRes, pRes, sRes] = await Promise.all([
        getBooksAction({ limit: 500, includeInactive: true }),
        getAuthorsAction(),
        getPublishersAction(),
        getActiveSubjectsAction(),
      ]);

      if (bRes.data) setBooks(bRes.data);
      if (aRes.data) setAuthors(aRes.data);
      if (pRes.data) setPublishers(pRes.data);
      if (sRes.data) setSubjects(sRes.data);
    } catch {
      showToast("error", "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate Insight Metrics
  const insights: BookInsights = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    for (const b of books) {
      if (b.stock === 0) {
        outOfStock++;
      } else if (b.stock <= 5) {
        lowStock++;
      } else {
        inStock++;
      }
    }

    return {
      total: books.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [books]);

  // Authors & Subjects maps for fast search lookup
  const authorNameMap = useMemo(
    () => new Map(authors.map((a) => [a.id, a.name.toLowerCase()])),
    [authors]
  );
  const publisherNameMap = useMemo(
    () => new Map(publishers.map((p) => [p.id, p.name.toLowerCase()])),
    [publishers]
  );

  // Filtered Books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Search Query
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const matchesName = book.name.toLowerCase().includes(query);
        const matchesAuthor = book.authorId
          ? authorNameMap.get(book.authorId)?.includes(query)
          : false;
        const matchesPublisher = book.publisherId
          ? publisherNameMap.get(book.publisherId)?.includes(query)
          : false;
        const matchesId = book.id.toLowerCase().includes(query);

        if (!matchesName && !matchesAuthor && !matchesPublisher && !matchesId) {
          return false;
        }
      }

      // 2. Status
      if (filters.status === "published") {
        if (!book.isActive) return false;
      } else if (filters.status === "inactive" || filters.status === "draft") {
        if (book.isActive) return false;
      } else if (filters.status === "in_stock") {
        if (book.stock <= 0) return false;
      } else if (filters.status === "low_stock") {
        if (book.stock <= 0 || book.stock > 5) return false;
      } else if (filters.status === "out_of_stock") {
        if (book.stock > 0) return false;
      }

      // 3. Category / Subject
      if (filters.subjectId && book.subjectId !== filters.subjectId) {
        return false;
      }

      // 4. Date Range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const createdDate = new Date(book.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (createdDate < start || createdDate > end) {
          return false;
        }
      }

      // 5. Format
      if (filters.format && book.format !== filters.format) {
        return false;
      }

      // 6. Featured
      if (filters.isFeatured !== undefined && book.isFeatured !== filters.isFeatured) {
        return false;
      }

      // 7. Pre-order
      if (filters.isPreorder !== undefined && book.isPreorder !== filters.isPreorder) {
        return false;
      }

      return true;
    });
  }, [books, filters, authorNameMap, publisherNameMap]);

  // Paginated books slice
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  // Adjust page if current page becomes out of bounds
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredBooks.length, pageSize, currentPage]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBooks.map((b) => b.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<BookFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      subjectId: "",
      dateRange: null,
      format: undefined,
      isFeatured: undefined,
      isPreorder: undefined,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <BooksToast toast={toast} onClose={() => setToast(null)} />

      {/* Header with Title & Add Product Button */}
      <BooksHeader
        totalCount={books.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <BooksInsightCards
        insights={insights}
        activeStatus={filters.status}
        onSelectFilter={(status: BookStatusFilter) => {
          handleFilterChange({
            status: filters.status === status ? "all" : status,
          });
        }}
      />

      {/* Filter and Search Bar */}
      <BooksFilterBar
        filters={filters}
        subjects={subjects}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "product" : "products"} selected
          </span>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="font-medium text-gray-500 hover:text-gray-800"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Main Books Table */}
      <BooksTable
        books={paginatedBooks}
        authors={authors}
        publishers={publishers}
        subjects={subjects}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewBook={(book) => setViewingBook(book)}
        onEditBook={(book) => setEditingBook(book)}
        onDeleteBook={(book) => setDeletingBook(book)}
      />

      {/* Pagination Footer */}
      <BooksPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredBooks.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add New Book Modal */}
      {isAddModalOpen && (
        <BookCreateModal
          authors={authors}
          publishers={publishers}
          subjects={subjects}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(bookName) => {
            showToast("success", `"${bookName}" has been created successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Book Details Modal */}
      {viewingBook && (
        <BookViewModal
          book={viewingBook}
          authors={authors}
          publishers={publishers}
          subjects={subjects}
          onClose={() => setViewingBook(null)}
          onEdit={() => {
            const b = viewingBook;
            setViewingBook(null);
            setEditingBook(b);
          }}
        />
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <BookEditModal
          book={editingBook}
          authors={authors}
          publishers={publishers}
          subjects={subjects}
          onClose={() => setEditingBook(null)}
          onSaved={(bookName) => {
            showToast("success", `"${bookName}" updated successfully!`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Book Modal */}
      {deletingBook && (
        <BookDeleteModal
          book={deletingBook}
          onClose={() => setDeletingBook(null)}
          onDeleted={(bookName) => {
            showToast("success", `"${bookName}" has been removed.`);
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}
    </div>
  );
}
