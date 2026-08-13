/**
 * BookLife Database Seed Script
 * ──────────────────────────────
 * Creates:
 *  - 1 admin user  (admin@booklife.com / admin12345)
 *  - 20 authors
 *  - 20 publishers
 *  - 20 subjects (categories)
 *  - 400 books  (20 per subject, assigned to random author + publisher)
 *  - 10 hero banners
 *
 * Run:  bun run db:seed
 *
 * Uses the DIRECT_URL so it works outside the serverless HTTP driver.
 */

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

// ── DB connection (direct URL for seeding) ─────────────────────────────────
const sql = neon(process.env.DIRECT_URL ?? process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

// ── Minimal auth instance (only used to hash + insert the admin user) ──────
const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true },
  plugins: [adminPlugin({ defaultRole: "customer", adminRoles: ["admin"] })],
});

// ── ID helpers ─────────────────────────────────────────────────────────────
function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

// ── Seed data ──────────────────────────────────────────────────────────────

const AUTHOR_NAMES = [
  "শায়খ আহমাদুল্লাহ",
  "আরিফ আজাদ",
  "মিজানুর রহমান আজহারি",
  "ড. খন্দকার আব্দুল্লাহ জাহাঙ্গীর",
  "ড. আলী মুহাম্মাদ সাল্লাবী",
  "ডা. শামসুল আরেফীন",
  "ড. রাগিব সারজানী",
  "মুহাম্মাদ ইলিয়াস রিফায়ী",
  "আব্দুল্লাহ আল-মাহমুন",
  "মুফতি তারিক মাসউদ",
  "হুমায়ূন আহমেদ",
  "মুহম্মদ জাফর ইকবাল",
  "আনিসুল হক",
  "ইমদাদুল হক মিলন",
  "ড. ইউসুফ আল-কারযাবী",
  "মাওলানা আশরাফ আলী থানভী",
  "শায়খ নাসিরুদ্দিন আলবানী",
  "শায়খ সফিউর রহমান মুবারকপুরী",
  "নওমান আলি খান",
  "ড. ইদ্রিস মেলিয়ানী",
];

const PUBLISHER_NAMES = [
  "মাকতাবাতুল আযহার",
  "সিয়ান পাবলিকেশন",
  "গার্ডিয়ান পাবলিকেশন্স",
  "ওয়াফি পাবলিকেশন",
  "সমকালীন প্রকাশন",
  "রুহামা পাবলিকেশন",
  "পথিক প্রকাশন",
  "মুহাম্মাদীয়া লাইব্রেরী",
  "প্রথমা প্রকাশন",
  "অন্যপ্রকাশ",
  "আগামী প্রকাশনী",
  "মাওলা ব্রাদার্স",
  "সময় প্রকাশন",
  "পাঞ্জেরী পাবলিকেশন্স",
  "বাংলা একাডেমি",
  "ইসলামিক ফাউন্ডেশন বাংলাদেশ",
  "দারুস সালাম বাংলাদেশ",
  "তাওহীদ পাবলিকেশন্স",
  "হুদহুদ প্রকাশনী",
  "আদর্শ",
];

// 20 subjects with realistic Bangla titles + slugs
const SUBJECTS = [
  { title: "ইসলামি বই",                  slug: "islamic-books" },
  { title: "কুরআন ও তাফসির",             slug: "quran-tafsir" },
  { title: "হাদিস",                       slug: "hadith" },
  { title: "সিরাত ও জীবনী",              slug: "sirat-biography" },
  { title: "ইসলামি ইতিহাস",              slug: "islamic-history" },
  { title: "আত্ম-উন্নয়ন ও মোটিভেশন",    slug: "self-development" },
  { title: "উপন্যাস",                     slug: "novel" },
  { title: "গল্প",                        slug: "story" },
  { title: "শিশু-কিশোর বই",              slug: "children-books" },
  { title: "একাডেমিক",                    slug: "academic" },
  { title: "বিজ্ঞান ও প্রযুক্তি",        slug: "science-technology" },
  { title: "ব্যবসা ও অর্থনীতি",          slug: "business-economics" },
  { title: "ইতিহাস ও ঐতিহ্য",           slug: "history-heritage" },
  { title: "ছড়া ও কবিতা",               slug: "poetry" },
  { title: "রহস্য ও থ্রিলার",             slug: "mystery-thriller" },
  { title: "স্বাস্থ্য ও পরিচর্যা",       slug: "health-care" },
  { title: "রাজনীতি বিষয়ক",             slug: "politics" },
  { title: "ভ্রমণ ও প্রবাস",             slug: "travel" },
  { title: "দর্শন ও চিন্তা",             slug: "philosophy" },
  { title: "আরবি ভাষা শিক্ষা",           slug: "arabic-language" },
];

// Book title templates per subject (20 per subject)
function generateBookTitles(subject: string, count: number): string[] {
  const prefixes = [
    "আলোর পথে", "সত্যের সন্ধানে", "জ্ঞানের আলো", "হৃদয়ের কথা",
    "মনের গভীরে", "স্বপ্নের পথে", "জীবনের ছন্দে", "বিশ্বাসের আলো",
    "আশার কিরণ", "নতুন দিগন্ত", "শান্তির বার্তা", "প্রজ্ঞার কথা",
    "সাফল্যের রহস্য", "মুক্তির পথ", "সঠিক পথের দিশা", "অন্তরের কথা",
    "জীবন বদলের গল্প", "পরিবর্তনের বাতাস", "উজ্জীবনের গান", "নতুন ভোরের আলো",
  ];
  return prefixes.slice(0, count).map((p, i) => `${p} — ${subject} (${i + 1})`);
}

// Cover images — cycle through the 28 available book cover images
function coverImg(index: number): string {
  return `/book_cover_img/book_cover_img (${index % 28}).webp`;
}

// ── Main seed function ─────────────────────────────────────────────────────

async function seed() {
  console.log("🌱  Starting BookLife seed...\n");

  // ── 1. Push schema (create tables if they don't exist) ──────────────────
  // Tables are created by `bun run db:push` — seed assumes they already exist.

  // ── 2. Create admin user via BetterAuth API ────────────────────────────
  console.log("👤  Creating admin user...");
  try {
    const signUpRes = await auth.api.signUpEmail({
      body: {
        name: "Admin",
        email: "admin@booklife.com",
        password: "admin12345",
      },
    });

    // Upgrade role to admin using a direct DB update
    // (BetterAuth sign-up always defaults to customer)
    await db
      .update(schema.users)
      .set({ role: "admin" })
      .where(
        (await import("drizzle-orm")).eq(schema.users.id, signUpRes.user.id),
      );

    console.log("   ✅  Admin created: admin@booklife.com / admin12345");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      console.log("   ⚠️   Admin already exists — skipping");
    } else {
      console.error("   ❌  Admin creation failed:", msg);
      // Non-fatal — continue seeding data
    }
  }

  // ── 3. Authors ────────────────────────────────────────────────────────
  console.log("\n✍️   Seeding 20 authors...");
  const authorIds: string[] = [];
  for (const name of AUTHOR_NAMES) {
    const id = uid("auth");
    authorIds.push(id);
    await db
      .insert(schema.authors)
      .values({ id, name, imageUrl: "/book_cover_img/author-placeholder.png" })
      .onConflictDoNothing();
  }
  console.log(`   ✅  ${authorIds.length} authors inserted`);

  // ── 4. Publishers ────────────────────────────────────────────────────
  console.log("\n🏢  Seeding 20 publishers...");
  const publisherIds: string[] = [];
  for (const name of PUBLISHER_NAMES) {
    const id = uid("pub");
    publisherIds.push(id);
    await db
      .insert(schema.publishers)
      .values({ id, name, logoUrl: "/brand_logos/wafilife-logo.svg" })
      .onConflictDoNothing();
  }
  console.log(`   ✅  ${publisherIds.length} publishers inserted`);

  // ── 5. Subjects ──────────────────────────────────────────────────────
  console.log("\n🏷️   Seeding 20 subjects...");
  const subjectIds: string[] = [];
  for (let i = 0; i < SUBJECTS.length; i++) {
    const { title, slug } = SUBJECTS[i];
    const id = uid("sub");
    subjectIds.push(id);
    await db
      .insert(schema.subjects)
      .values({ id, title, slug, isActive: true, sortOrder: String(i) })
      .onConflictDoNothing();
  }
  console.log(`   ✅  ${subjectIds.length} subjects inserted`);

  // ── 6. Books — 20 per subject ────────────────────────────────────────
  console.log("\n📚  Seeding 400 books (20 per subject)...");
  let bookCount = 0;
  for (let si = 0; si < subjectIds.length; si++) {
    const subjectId = subjectIds[si];
    const subjectTitle = SUBJECTS[si].title;
    const titles = generateBookTitles(subjectTitle, 20);

    for (let bi = 0; bi < 20; bi++) {
      const id = uid("book");
      const authorId = authorIds[(si * 20 + bi) % authorIds.length];
      const publisherId = publisherIds[(si * 20 + bi) % publisherIds.length];
      const basePrice = 120 + (si * 20 + bi) * 15; // ৳120–৳740 range
      const hasDiscount = bi % 3 !== 0; // ~2/3 of books have a discount
      const discountPrice = hasDiscount
        ? Math.round(basePrice * (0.65 + Math.random() * 0.2))
        : null;

      await db
        .insert(schema.books)
        .values({
          id,
          name: titles[bi],
          pricePaisa: basePrice * 100,
          discountPricePaisa: discountPrice ? discountPrice * 100 : null,
          stock: 10 + bi * 2,
          imageUrl: coverImg(si * 20 + bi),
          isActive: true,
          isFeatured: bi === 0, // first book of each subject is featured
          isPreorder: bi === 19, // last book of each subject is pre-order
          format: (["paperback", "hardcover", "ebook"] as const)[bi % 3],
          totalPages: 150 + bi * 20,
          authorId,
          publisherId,
          subjectId,
        })
        .onConflictDoNothing();

      bookCount++;
    }
    process.stdout.write(`   📖  Subject ${si + 1}/20 done (${bookCount} books)\r`);
  }
  console.log(`\n   ✅  ${bookCount} books inserted`);

  // ── 7. Hero banners ──────────────────────────────────────────────────
  console.log("\n🖼️   Seeding 10 hero banners...");
  for (let i = 1; i <= 10; i++) {
    const id = uid("bnr");
    await db
      .insert(schema.banners)
      .values({
        id,
        type: "hero",
        title: `বিশেষ অফার ${i}`,
        imageUrl: `/banner_large_device/hero-banner-img-large-device (${i}).webp`,
        mobileImageUrl: `/banner_small_device/hero-banner-img-small-device (${i % 10}).webp`,
        linkUrl: "/subjects",
        isActive: true,
        sortOrder: i - 1,
      })
      .onConflictDoNothing();
  }
  console.log("   ✅  10 hero banners inserted");

  console.log("\n✨  Seed complete!\n");
  console.log("┌─────────────────────────────────────────┐");
  console.log("│  Admin login credentials:               │");
  console.log("│  Email:    admin@booklife.com           │");
  console.log("│  Password: admin12345                   │");
  console.log("│                                         │");
  console.log("│  Admin dashboard: /dashboard            │");
  console.log("└─────────────────────────────────────────┘\n");
}

seed().catch((err) => {
  console.error("\n💥  Seed failed:", err);
  process.exit(1);
});
