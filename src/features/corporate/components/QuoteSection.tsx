import { QuoteForm } from "./QuoteForm";

export function QuoteSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column - Contact Info */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            কোটেশন রিকোয়েস্ট করুন
          </h2>
          <p className="mb-8 text-gray-600">
            আপনার প্রয়োজনীয় বইয়ের তালিকা এবং তথ্য দিন। আমাদের টিম ২৪ ঘণ্টার
            মধ্যে আপনার সাথে যোগাযোগ করবে।
          </p>
          <div className="inline-block rounded-lg border border-gray-100 bg-gray-50 p-6">
            <p className="mb-2 text-sm font-medium text-gray-800">
              সরাসরি যোগাযোগ করুন:
            </p>
            <p className="font-semibold text-[#E32626]">01324299979</p>
            <p className="text-[#E32626]">corporate@wafilife.com</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
