"use client";

/**
 * DashboardOverview — Admin Analytics Dashboard
 *
 * Fetches real data from the DB via getDashboardAnalyticsAction and renders:
 *
 *  Row 1 — 4 KPI stat cards (Revenue, Orders, Users, Books)
 *  Row 2 — smaller cards (Authors, Publishers, Subjects, Active Coupons)
 *  Row 3 — Order Status breakdown chips
 *  Row 4 — Top 5 books per category (accordion-style)
 *  Row 5 — Recent 10 orders table
 *  Row 6 — Quick-link management cards (same as before)
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  BookOpen,
  Building2,
  Tag,
  Star,
  Ticket,
  Image as ImageIcon,
  UserCog,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import { getDashboardAnalyticsAction } from "../actions/analytics.actions";
import type { DashboardAnalytics } from "../actions/analytics.actions";

// ── Helpers ────────────────────────────────────────────────────────────────

function taka(paisa: number) {
  return new Intl.NumberFormat("en-BD").format(Math.round(paisa / 100));
}

function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_COLOURS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100  text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100   text-red-600",
};

const STATUS_BN: Record<string, string> = {
  pending:   "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  shipped:   "শিপড",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-5 shadow-sm ${
        accent
          ? "border-red-100 bg-gradient-to-br from-red-50 to-white"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p
          className={`text-2xl font-bold ${accent ? "text-red-600" : "text-gray-900"}`}
        >
          {value}
        </p>
        {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function SmallStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ── Category accordion row ─────────────────────────────────────────────────

function CategoryRow({
  subjectTitle,
  topBooks,
}: {
  subjectTitle: string;
  topBooks: DashboardAnalytics["topBooksPerCategory"][0]["books"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{subjectTitle}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-normal text-gray-400">
            Top {topBooks.length} বই
          </span>
          {open ? (
            <ChevronUp className="size-4 text-gray-400" />
          ) : (
            <ChevronDown className="size-4 text-gray-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-2 text-left font-medium">#</th>
                <th className="pb-2 text-left font-medium">Book</th>
                <th className="pb-2 text-right font-medium">Units Sold</th>
                <th className="pb-2 text-right font-medium">Revenue (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topBooks.map((b, idx) => (
                <tr key={b.bookId} className="hover:bg-gray-50">
                  <td className="py-2 pr-3 text-gray-400">{idx + 1}</td>
                  <td className="max-w-xs truncate py-2 font-medium text-gray-800">
                    {b.bookName}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {b.unitsSold.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-semibold text-green-700">
                    {taka(b.revenuePaisa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Management quick-links ─────────────────────────────────────────────────

const MGMT_LINKS = [
  { label: "Books",       href: "/dashboard/books",       icon: BookOpen,    desc: "বই যোগ, সম্পাদনা ও মুছুন"  },
  { label: "Authors",     href: "/dashboard/authors",     icon: Users,       desc: "লেখক পরিচালনা"              },
  { label: "Publishers",  href: "/dashboard/publishers",  icon: Building2,   desc: "প্রকাশনী পরিচালনা"          },
  { label: "Subjects",    href: "/dashboard/subjects",    icon: Tag,         desc: "বিষয় ও ক্যাটাগরি"           },
  { label: "Reviews",     href: "/dashboard/reviews",     icon: Star,        desc: "রিভিউ মডারেশন"              },
  { label: "Coupons",     href: "/dashboard/coupons",     icon: Ticket,      desc: "কুপন তৈরি ও মুছুন"          },
  { label: "Banners",     href: "/dashboard/banners",     icon: ImageIcon,   desc: "ক্যারাউসেল ব্যানার"          },
  { label: "Orders",      href: "/dashboard/orders",      icon: ShoppingBag, desc: "অর্ডার স্ট্যাটাস আপডেট"     },
  { label: "Users",       href: "/dashboard/users",       icon: UserCog,     desc: "ব্যবহারকারী ও রোল"          },
  { label: "Permissions", href: "/dashboard/permissions", icon: UserCog,     desc: "মডারেটর পারমিশন"            },
];

// ── Main Component ─────────────────────────────────────────────────────────

export function DashboardOverview() {
  const [data, setData]       = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await getDashboardAnalyticsAction();
    if (res.error) setError(res.error);
    else setData(res.data ?? null);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-400">
        <RefreshCw className="size-8 animate-spin text-red-300" />
        <p className="text-sm">Analytics লোড হচ্ছে…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <AlertCircle className="size-10 text-red-300" />
        <p className="text-sm font-medium text-gray-600">{error}</p>
        <button
          onClick={load}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const { summary, ordersByStatus, topBooksPerCategory, recentOrders } =
    data ?? {
      summary: {
        totalRevenuePaisa: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalBooks: 0,
        totalAuthors: 0,
        totalPublishers: 0,
        totalSubjects: 0,
      },
      ordersByStatus: [],
      topBooksPerCategory: [],
      recentOrders: [],
    };

  const deliveredCount =
    ordersByStatus.find((o) => o.status === "delivered")?.count ?? 0;
  const pendingCount =
    ordersByStatus.find((o) => o.status === "pending")?.count ?? 0;

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            BookLife Analytics — real-time from database
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 shadow-sm"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {/* ── Row 1 — Primary KPI cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="মোট রাজস্ব (Revenue)"
          value={`৳${taka(summary.totalRevenuePaisa)}`}
          sub="Delivered + Confirmed + Shipped"
          accent
        />
        <StatCard
          icon={ShoppingBag}
          label="মোট অর্ডার"
          value={summary.totalOrders.toLocaleString()}
          sub={`${deliveredCount} ডেলিভারি · ${pendingCount} অপেক্ষমাণ`}
        />
        <StatCard
          icon={Users}
          label="মোট ব্যবহারকারী"
          value={summary.totalUsers.toLocaleString()}
        />
        <StatCard
          icon={BookOpen}
          label="মোট বই"
          value={summary.totalBooks.toLocaleString()}
        />
      </div>

      {/* ── Row 2 — Secondary counts ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SmallStatCard icon={Users}     label="লেখক"     value={summary.totalAuthors}    />
        <SmallStatCard icon={Building2} label="প্রকাশনী" value={summary.totalPublishers} />
        <SmallStatCard icon={Tag}       label="বিষয়"     value={summary.totalSubjects}   />
        <SmallStatCard icon={Package}   label="অর্ডার স্ট্যাটাস" value={ordersByStatus.length + " ধরন"} />
      </div>

      {/* ── Row 3 — Order status breakdown ──────────────────────────────── */}
      {ordersByStatus.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            অর্ডার স্ট্যাটাস বিশ্লেষণ
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ordersByStatus.map((o) => (
              <div
                key={o.status}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <span
                  className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    STATUS_COLOURS[o.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_BN[o.status] ?? o.status}
                </span>
                <p className="text-xl font-bold text-gray-900">
                  {o.count.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500">
                  ৳{taka(o.revenuePaisa)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Row 4 — Top 5 books per category ────────────────────────────── */}
      {topBooksPerCategory.length > 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-700">
              প্রতিটি ক্যাটাগরিতে সেরা ৫ বই (বিক্রয় অনুযায়ী)
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              ক্যাটাগরির উপর ক্লিক করুন বিস্তারিত দেখতে
            </p>
          </div>
          {topBooksPerCategory.map((cat) => (
            <CategoryRow
              key={cat.subjectId}
              subjectTitle={cat.subjectTitle}
              topBooks={cat.books}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            এখনো কোনো অর্ডার নেই — সেলস ডেটা আসবে অর্ডারের পর।
          </p>
        </div>
      )}

      {/* ── Row 5 — Recent orders ────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-700">
            সাম্প্রতিক ১০টি অর্ডার
          </h2>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
          >
            সব দেখুন <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            কোনো অর্ডার নেই
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Order ID</th>
                  <th className="px-5 py-3 text-left font-medium">প্রাপক</th>
                  <th className="px-5 py-3 text-left font-medium">তারিখ</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">মোট (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">
                      {o.id}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {o.recipientName}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {fmtDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_COLOURS[o.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_BN[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">
                      {taka(o.totalPaisa)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Row 6 — Management quick-links ──────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MGMT_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors group-hover:bg-red-100">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 transition-colors group-hover:text-red-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
