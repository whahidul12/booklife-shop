"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Home, ArrowLeft, BookOpen } from "lucide-react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";

const TARGET = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Countdown tile
function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-18 flex-col items-center gap-1">
      <div className="flex size-16 items-center justify-center rounded-xl border border-gray-100 bg-white text-2xl font-extrabold text-gray-900 shadow-sm sm:size-20 sm:text-3xl">
        {pad(value)}
      </div>
      <span className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">
        {label}
      </span>
    </div>
  );
}

//  Notify form
function NotifyForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        <Bell className="size-4 shrink-0" />
        আপনার ইমেইল সংরক্ষিত হয়েছে। চালু হলে জানিয়ে দেওয়া হবে!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="mb-2 block text-sm font-medium text-gray-600">
        প্রথমে জানতে চান? নোটিফিকেশন পান
      </label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="আপনার ইমেইল ঠিকানা"
          className="h-10 flex-1 rounded-lg border border-gray-200 px-4 text-sm outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
        >
          <Bell className="size-3.5" />
          জানান
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </form>
  );
}

// Feature preview cards
const FEATURES = [
  {
    icon: "📦",
    title: "দ্রুত ডেলিভারি",
    desc: "সারা বাংলাদেশে দ্রুততম শিপিং সেবা",
  },
  {
    icon: "💳",
    title: "সহজ পেমেন্ট",
    desc: "bKash, Nagad, Rocket ও কার্ড পেমেন্ট",
  },
  { icon: "📚", title: "বিশাল সংগ্রহ", desc: "ইসলামিক, একাডেমিক ও জেনারেল বই" },
  { icon: "🎁", title: "বিশেষ অফার", desc: "সদস্যদের জন্য এক্সক্লুসিভ ছাড়" },
];

// Main export
export function ComingSoonContent() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center bg-linear-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      {/* ── Logo mark ── */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-200">
          <Image
            src="/brand_logos/wafilife-logo.svg"
            alt="WafiLife"
            width={56}
            height={40}
            className="brightness-0 invert"
          />
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
          শীঘ্রই আসছে
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          আমরা কাজ করছি
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500">
          এই বিভাগটি শীঘ্রই চালু হবে। একটু অপেক্ষা করুন — আমরা আপনার জন্য সেরা
          অভিজ্ঞতা তৈরি করছি।
        </p>
      </div>

      {/* ── Countdown ── */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Tile value={timeLeft.days} label="দিন" />
        <span className="mb-5 text-2xl font-bold text-gray-300">:</span>
        <Tile value={timeLeft.hours} label="ঘণ্টা" />
        <span className="mb-5 text-2xl font-bold text-gray-300">:</span>
        <Tile value={timeLeft.minutes} label="মিনিট" />
        <span className="mb-5 text-2xl font-bold text-gray-300">:</span>
        <Tile value={timeLeft.seconds} label="সেকেন্ড" />
      </div>

      {/* ── Notify form ── */}
      <div className="mb-10 w-full max-w-md">
        <NotifyForm />
      </div>

      {/* ── Feature preview ── */}
      <div className="mb-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-xs transition hover:border-red-100 hover:shadow-sm"
          >
            <span className="text-2xl">{f.icon}</span>
            <p className="text-xs font-semibold text-gray-800">{f.title}</p>
            <p className="text-[11px] leading-snug text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Social links ── */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">আপডেটের জন্য আমাদের অনুসরণ করুন</p>
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex size-9 items-center justify-center rounded-full bg-[#3b5998] text-white transition-opacity hover:opacity-90"
          >
            <FaFacebook className="size-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-9 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white transition-opacity hover:opacity-90"
          >
            <IoLogoInstagram className="size-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex size-9 items-center justify-center rounded-full bg-[#ff0000] text-white transition-opacity hover:opacity-90"
          >
            <FaYoutube className="size-4" />
          </a>
        </div>
      </div>

      {/* ── Navigation shortcuts ── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:border-red-300 hover:text-red-600"
        >
          <Home className="size-4" />
          হোমপেজে যান
        </Link>
        <Link
          href="/books/new-releases"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:border-red-300 hover:text-red-600"
        >
          <BookOpen className="size-4" />
          নতুন বই দেখুন
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:border-red-300 hover:text-red-600"
        >
          <ArrowLeft className="size-4" />
          আগের পাতায় ফিরুন
        </button>
      </div>
    </main>
  );
}
