"use server";

/**
 * Analytics Server Actions — admin-only.
 *
 * getDashboardAnalytics() returns everything the DashboardOverview needs
 * in a single network round-trip:
 *
 *  - Summary counts   : totalRevenuePaisa, totalOrders, totalUsers,
 *                       totalBooks, totalAuthors, totalPublishers
 *  - Orders by status : { status, count, revenuePaisa }[]
 *  - Top 5 books per category (subject) by units sold
 *  - Recent 10 orders with buyer name snapshot
 */
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  books,
  subjects,
  users,
  authors,
  publishers,
} from "@/db/schema";
import { eq, sql, desc, count, sum, and } from "drizzle-orm";
import { requireAuth, ActionError } from "@/lib/action-guard";
import type { ActionResult } from "@/lib/action-guard";

// ── Types returned to the client ───────────────────────────────────────────

export interface SummaryStats {
  totalRevenuePaisa:  number;
  totalOrders:        number;
  totalUsers:         number;
  totalBooks:         number;
  totalAuthors:       number;
  totalPublishers:    number;
  totalSubjects:      number;
}

export interface OrdersByStatus {
  status:       string;
  count:        number;
  revenuePaisa: number;
}

export interface TopBook {
  bookId:       string;
  bookName:     string;
  subjectId:    string | null;
  subjectTitle: string | null;
  unitsSold:    number;
  revenuePaisa: number;
}

export interface RecentOrder {
  id:              string;
  totalPaisa:      number;
  status:          string;
  paymentMethod:   string;
  paymentStatus:   string;
  createdAt:       Date;
  /** Parsed from shippingAddressSnapshot */
  recipientName:   string;
}

export interface CategoryTopBooks {
  subjectId:    string;
  subjectTitle: string;
  books:        TopBook[];
}

export interface DashboardAnalytics {
  summary:          SummaryStats;
  ordersByStatus:   OrdersByStatus[];
  topBooksPerCategory: CategoryTopBooks[];
  recentOrders:     RecentOrder[];
}

// ── Helper — parse recipient name from JSON snapshot ─────────────────────

function parseRecipientName(snapshot: string): string {
  try {
    const obj = JSON.parse(snapshot) as { recipientName?: string };
    return obj.recipientName ?? "—";
  } catch {
    return "—";
  }
}

// ── Main action ────────────────────────────────────────────────────────────

export async function getDashboardAnalyticsAction(): Promise<
  ActionResult<DashboardAnalytics>
> {
  try {
    const session = await requireAuth();
    const role = (session.user as { role?: string }).role ?? "customer";
    if (role !== "admin" && role !== "moderator") {
      return { error: "শুধুমাত্র admin/moderator এই তথ্য দেখতে পারবেন" };
    }

    // ── Run all independent queries in parallel ───────────────────────────
    const [
      revenueRow,
      orderCountRow,
      userCountRow,
      bookCountRow,
      authorCountRow,
      publisherCountRow,
      subjectCountRow,
      ordersByStatusRows,
      topBooksRows,
      recentOrderRows,
    ] = await Promise.all([
      // 1. Total revenue (delivered + confirmed + shipped orders only)
      db
        .select({ total: sum(orders.totalPaisa) })
        .from(orders)
        .where(
          sql`${orders.status} IN ('delivered', 'confirmed', 'shipped')`,
        )
        .then((r) => r[0]),

      // 2. Total order count (all statuses)
      db.select({ c: count() }).from(orders).then((r) => r[0]),

      // 3. Total user count
      db.select({ c: count() }).from(users).then((r) => r[0]),

      // 4. Total book count
      db.select({ c: count() }).from(books).then((r) => r[0]),

      // 5. Total author count
      db.select({ c: count() }).from(authors).then((r) => r[0]),

      // 6. Total publisher count
      db.select({ c: count() }).from(publishers).then((r) => r[0]),

      // 7. Total subject count
      db.select({ c: count() }).from(subjects).then((r) => r[0]),

      // 8. Orders grouped by status
      db
        .select({
          status:       orders.status,
          count:        count(),
          revenuePaisa: sum(orders.totalPaisa),
        })
        .from(orders)
        .groupBy(orders.status),

      // 9. Top books by units sold (join order_items → books → subjects)
      db
        .select({
          bookId:       orderItems.bookId,
          bookName:     orderItems.bookNameSnapshot,
          subjectId:    books.subjectId,
          unitsSold:    sum(orderItems.quantity).mapWith(Number),
          revenuePaisa: sum(
            sql<number>`${orderItems.quantity} * COALESCE(${orderItems.discountPricePaisa}, ${orderItems.unitPricePaisa})`,
          ).mapWith(Number),
        })
        .from(orderItems)
        .innerJoin(books, eq(books.id, orderItems.bookId))
        .groupBy(orderItems.bookId, orderItems.bookNameSnapshot, books.subjectId)
        .orderBy(
          desc(sum(orderItems.quantity)),
        )
        .limit(100), // fetch top 100, we'll slice per category client-side

      // 10. Recent 10 orders
      db
        .select({
          id:                      orders.id,
          totalPaisa:              orders.totalPaisa,
          status:                  orders.status,
          paymentMethod:           orders.paymentMethod,
          paymentStatus:           orders.paymentStatus,
          createdAt:               orders.createdAt,
          shippingAddressSnapshot: orders.shippingAddressSnapshot,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(10),
    ]);

    // ── Build summary ─────────────────────────────────────────────────────
    const summary: SummaryStats = {
      totalRevenuePaisa:  Number(revenueRow?.total ?? 0),
      totalOrders:        Number(orderCountRow?.c ?? 0),
      totalUsers:         Number(userCountRow?.c ?? 0),
      totalBooks:         Number(bookCountRow?.c ?? 0),
      totalAuthors:       Number(authorCountRow?.c ?? 0),
      totalPublishers:    Number(publisherCountRow?.c ?? 0),
      totalSubjects:      Number(subjectCountRow?.c ?? 0),
    };

    // ── Orders by status ──────────────────────────────────────────────────
    const ordersByStatus: OrdersByStatus[] = ordersByStatusRows.map((r) => ({
      status:       r.status,
      count:        Number(r.count),
      revenuePaisa: Number(r.revenuePaisa ?? 0),
    }));

    // ── Top books — fetch subject titles for all unique subjectIds ─────────
    const subjectIds = [
      ...new Set(
        topBooksRows
          .map((r) => r.subjectId)
          .filter((id): id is string => !!id),
      ),
    ];

    const subjectRows =
      subjectIds.length > 0
        ? await db
            .select({ id: subjects.id, title: subjects.title })
            .from(subjects)
            .where(sql`${subjects.id} = ANY(ARRAY[${sql.join(subjectIds.map((id) => sql`${id}`), sql`, `)}])`)
        : [];

    const subjectMap = new Map(subjectRows.map((s) => [s.id, s.title]));

    // Build per-category top-5
    const categoryMap = new Map<string, TopBook[]>();

    for (const r of topBooksRows) {
      const sid = r.subjectId ?? "__no_category__";
      if (!categoryMap.has(sid)) categoryMap.set(sid, []);
      const arr = categoryMap.get(sid)!;
      if (arr.length < 5) {
        arr.push({
          bookId:       r.bookId,
          bookName:     r.bookName,
          subjectId:    r.subjectId,
          subjectTitle: r.subjectId ? (subjectMap.get(r.subjectId) ?? "Unknown") : null,
          unitsSold:    r.unitsSold,
          revenuePaisa: r.revenuePaisa,
        });
      }
    }

    // Convert map → sorted array (most units in the category first)
    const topBooksPerCategory: CategoryTopBooks[] = [];
    for (const [sid, topBooks] of categoryMap.entries()) {
      if (sid === "__no_category__") continue; // skip uncategorised
      topBooksPerCategory.push({
        subjectId:    sid,
        subjectTitle: subjectMap.get(sid) ?? "Unknown",
        books:        topBooks,
      });
    }
    // Sort categories by their top book's units sold
    topBooksPerCategory.sort(
      (a, b) => (b.books[0]?.unitsSold ?? 0) - (a.books[0]?.unitsSold ?? 0),
    );

    // ── Recent orders ─────────────────────────────────────────────────────
    const recentOrders: RecentOrder[] = recentOrderRows.map((r) => ({
      id:            r.id,
      totalPaisa:    r.totalPaisa,
      status:        r.status,
      paymentMethod: r.paymentMethod,
      paymentStatus: r.paymentStatus,
      createdAt:     r.createdAt,
      recipientName: parseRecipientName(r.shippingAddressSnapshot),
    }));

    return {
      data: {
        summary,
        ordersByStatus,
        topBooksPerCategory,
        recentOrders,
      },
    };
  } catch (err) {
    if (err instanceof ActionError) return { error: err.message };
    const msg = err instanceof Error ? err.message : "Analytics লোড করা যায়নি";
    return { error: msg };
  }
}
