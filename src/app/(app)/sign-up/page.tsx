import { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export const metadata: Metadata = {
  title: "নিবন্ধন | BookLife",
  description: "নতুন একাউন্ট তৈরি করুন",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">নতুন একাউন্ট</h1>
          <p className="mt-2 text-sm text-gray-600">
            বিনামূল্যে নিবন্ধন করুন এবং বই কিনুন
          </p>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
