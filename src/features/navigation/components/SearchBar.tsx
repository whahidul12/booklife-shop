import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="order-3 w-full lg:order-0 lg:flex-1">
      <div className="relative">
        <input
          type="search"
          placeholder="বইয়ের নাম ও লেখক দিয়ে অনুসন্ধান করুন"
          aria-label="বই ও লেখক অনুসন্ধান করুন"
          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand h-11 w-full rounded-md border px-4 pr-12 text-sm outline-none focus:ring-1"
        />
        <button
          type="button"
          aria-label="অনুসন্ধান করুন"
          className="text-muted-foreground hover:text-brand focus-visible:ring-ring absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
