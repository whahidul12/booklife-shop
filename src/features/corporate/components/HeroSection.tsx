export function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center bg-[#E32626] px-4 py-16 text-center text-white md:py-24">
      <h1 className="mb-4 text-3xl font-bold md:text-5xl">
        ওয়াফিলাইফ কর্পোরেট সার্ভিস
      </h1>
      <p className="mb-8 max-w-2xl text-base md:text-lg">
        আপনার প্রতিষ্ঠান, স্কুল ও কলেজ, বিশ্ববিদ্যালয়, মাদ্রাসা বা সংস্থার জন্য
        যে কোন পরিমাণ বই অথবা গিফট আইটেম অর্ডার করুন সর্বোচ্চ ছাড়ে।
      </p>
      <button className="mb-6 rounded-md bg-white px-8 py-3 font-semibold text-[#E32626] shadow-sm transition-colors hover:bg-gray-50">
        Request a Quote
      </button>
      <p className="text-sm">
        corporate@wafilife.com (9.00AM - 7.00PM) | Call: 01324299979
      </p>
    </section>
  );
}
