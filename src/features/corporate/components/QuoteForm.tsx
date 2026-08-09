"use client";
import { UploadCloud } from "lucide-react";
import { useQuoteForm } from "../hooks/useQuoteForm";

export function QuoteForm() {
  const { handleSubmit, isSubmitting, successMessage } = useQuoteForm();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            নাম *
          </label>
          <input
            required
            type="text"
            placeholder="আপনার নাম লিখুন"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ফোন নম্বর *
          </label>
          <input
            required
            type="tel"
            placeholder="আপনার ফোন নম্বর লিখুন"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            প্রতিষ্ঠানের নাম
          </label>
          <input
            type="text"
            placeholder="প্রতিষ্ঠানের নাম লিখুন (ঐচ্ছিক)"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ইমেইল
          </label>
          <input
            type="email"
            placeholder="আপনার ইমেইল লিখুন (ঐচ্ছিক)"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            বার্তা / বিবরণ
          </label>
          <textarea
            rows={4}
            placeholder="আপনার প্রয়োজনীয় বইয়ের তালিকা বা অন্যান্য তথ্য লিখুন"
            className="w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-red-500 focus:ring-red-500"
          ></textarea>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            কোটেশন ফাইল আপলোড করুন (ঐচ্ছিক)
          </label>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100">
            <UploadCloud className="mb-2 text-gray-400" size={32} />
            <span className="text-sm text-gray-600">
              ফাইল বেছে নিন বা এখানে ড্রপ করুন
            </span>
            <span className="mt-1 text-xs text-gray-400">
              PDF, Word, JPG, PNG - সর্বোচ্চ ৫ MB
            </span>
            <input type="file" className="hidden" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#E32626] py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
        >
          {isSubmitting ? "পাঠানো হচ্ছে..." : "কোটেশন পাঠান"}
        </button>
        {successMessage && (
          <p className="mt-2 text-sm text-green-600">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
