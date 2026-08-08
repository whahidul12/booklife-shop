"use client";

import { MessageSquare } from "lucide-react";

export function QASection() {
  return (
    <section className="mt-8 rounded-md border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
        <MessageSquare className="size-5 text-red-600" />
        <span>গ্রাহক প্রশ্নোত্তর</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          0
        </span>
      </div>

      <div className="mt-6">
        <button className="rounded border border-red-600 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
          প্রশ্ন করুন
        </button>
      </div>
    </section>
  );
}
