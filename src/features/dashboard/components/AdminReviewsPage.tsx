"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Review, Book } from "@/db/schema";
import {
  getAllReviewsAction,
  hideReviewAction,
  unhideReviewAction,
} from "@/features/reviews/actions/reviews.actions";
import { getBooksAction } from "@/features/books/actions/books.actions";
import {
  ReviewsHeader,
  ReviewsInsightCards,
  ReviewsFilterBar,
  ReviewsTable,
  ReviewsPagination,
  ReviewViewModal,
  ReviewEditModal,
  ReviewCreateModal,
  ReviewDeleteModal,
  ReviewsToast,
  type ReviewFilterState,
  type ReviewStatusFilter,
  type ReviewInsights,
  type ToastMessage,
} from "./reviews";

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filters state
  const [filters, setFilters] = useState<ReviewFilterState>({
    search: "",
    status: "all",
    rating: "all",
    dateRange: null,
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

  // Load reviews & books
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, bRes] = await Promise.all([
        getAllReviewsAction(),
        getBooksAction({ limit: 500, includeInactive: true }),
      ]);

      if (rRes.data) setReviews(rRes.data);
      if (bRes.data) setBooks(bRes.data);
    } catch {
      showToast("error", "Failed to load reviews data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fast book lookup map
  const bookMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  // Calculate Insight Metrics
  const insights: ReviewInsights = useMemo(() => {
    let visibleCount = 0;
    let hiddenCount = 0;
    let totalScore = 0;
    let fiveStarCount = 0;

    for (const r of reviews) {
      if (r.isHidden) {
        hiddenCount++;
      } else {
        visibleCount++;
      }
      totalScore += r.rating;
      if (r.rating === 5) fiveStarCount++;
    }

    const avgRating = reviews.length > 0 ? totalScore / reviews.length : 5.0;

    return {
      total: reviews.length,
      avgRating,
      visibleCount,
      hiddenCount,
      fiveStarCount,
    };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      // 1. Search query
      if (filters.search.trim() !== "") {
        const query = filters.search.trim().toLowerCase();
        const bookName = bookMap.get(rev.bookId)?.name.toLowerCase() || "";
        const comment = (rev.comment || "").toLowerCase();
        const userId = rev.userId.toLowerCase();
        const bookId = rev.bookId.toLowerCase();

        if (
          !comment.includes(query) &&
          !bookName.includes(query) &&
          !userId.includes(query) &&
          !bookId.includes(query)
        ) {
          return false;
        }
      }

      // 2. Status
      if (filters.status === "visible" && rev.isHidden) return false;
      if (filters.status === "hidden" && !rev.isHidden) return false;

      // 3. Rating
      if (filters.rating !== "all") {
        const targetRating = Number(filters.rating);
        if (rev.rating !== targetRating) return false;
      }

      // 4. Date range
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const revDate = new Date(rev.createdAt).getTime();
        const start = new Date(filters.dateRange.startDate).setHours(0, 0, 0, 0);
        const end = new Date(filters.dateRange.endDate).setHours(23, 59, 59, 999);
        if (revDate < start || revDate > end) return false;
      }

      return true;
    });
  }, [reviews, filters, bookMap]);

  // Paginated reviews slice
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  // Toggle Hide / Unhide handler
  async function handleToggleHide(review: Review) {
    try {
      const res = review.isHidden
        ? await unhideReviewAction(review.id)
        : await hideReviewAction(review.id);
      if (res.error) {
        showToast("error", res.error);
      } else {
        showToast(
          "success",
          review.isHidden
            ? "Review published to store"
            : "Review hidden from store"
        );
        loadData();
      }
    } catch {
      showToast("error", "Failed to update review visibility");
    }
  }

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReviews.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<ReviewFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      rating: "all",
      dateRange: null,
    });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <ReviewsToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <ReviewsHeader
        totalCount={reviews.length}
        loading={loading}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* KPI Insight Metric Cards */}
      <ReviewsInsightCards
        insights={insights}
        activeStatus={filters.status}
      // onSelectFilter={(status: ReviewStatusFilter) => {
      //   handleFilterChange({
      //     status: filters.status === status ? "all" : status,
      //   });
      // }}
      />

      {/* Filter and Search Bar */}
      <ReviewsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-gray-700 animate-in fade-in duration-150">
          <span className="font-semibold text-[#D10A13]">
            {selectedIds.length} {selectedIds.length === 1 ? "review" : "reviews"} selected
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

      {/* Main Reviews Table */}
      <ReviewsTable
        reviews={paginatedReviews}
        books={books}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onViewReview={(rev) => setViewingReview(rev)}
        onEditReview={(rev) => setEditingReview(rev)}
        onToggleHideReview={handleToggleHide}
        onDeleteReview={(rev) => setDeletingReview(rev)}
      />

      {/* Pagination Footer */}
      <ReviewsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredReviews.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <ReviewCreateModal
          books={books}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={() => {
            showToast("success", "Review created successfully!");
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* View Review Details Modal */}
      {viewingReview && (
        <ReviewViewModal
          review={viewingReview}
          bookName={bookMap.get(viewingReview.bookId)?.name}
          onClose={() => setViewingReview(null)}
          onEdit={() => {
            const r = viewingReview;
            setViewingReview(null);
            setEditingReview(r);
          }}
          onToggleHide={() => handleToggleHide(viewingReview)}
        />
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewEditModal
          review={editingReview}
          bookName={bookMap.get(editingReview.bookId)?.name}
          onClose={() => setEditingReview(null)}
          onSaved={() => {
            showToast("success", "Review updated successfully!");
            loadData();
          }}
          onError={(errorMsg) => {
            showToast("error", errorMsg);
          }}
        />
      )}

      {/* Delete Review Modal */}
      {deletingReview && (
        <ReviewDeleteModal
          review={deletingReview}
          bookName={bookMap.get(deletingReview.bookId)?.name}
          onClose={() => setDeletingReview(null)}
          onDeleted={() => {
            showToast("success", "Review deleted successfully.");
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
