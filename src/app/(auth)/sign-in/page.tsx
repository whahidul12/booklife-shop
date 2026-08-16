import { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/SignInForm";

export const metadata: Metadata = {
  title: "লগইন | BookLife",
  description: "আপনার একাউন্টে প্রবেশ করুন",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">লগইন করুন</h1>
          <p className="mt-2 text-sm text-gray-600">
            আপনার একাউন্টে প্রবেশ করতে নিচের তথ্য দিন
          </p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
