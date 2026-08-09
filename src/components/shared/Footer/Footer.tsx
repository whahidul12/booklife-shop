import {
  FooterBrand,
  FooterContact,
  FooterNavColumn,
  FooterNewsletter,
  POPULAR_LINKS,
  USEFUL_LINKS,
} from "@/features/footer";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {/* Column 1: Brand Info & Socials */}
          <FooterBrand />

          {/* Column 2: Useful Links */}
          <FooterNavColumn title="প্রয়োজনীয় লিংক" links={USEFUL_LINKS} />

          {/* Column 3: Popular Categories/Links */}
          <FooterNavColumn title="জনপ্রিয়" links={POPULAR_LINKS} />

          {/* Column 4: Contact Information */}
          <FooterContact />

          {/* Column 5: Newsletter Subscription */}
          <FooterNewsletter />
        </div>
      </div>
    </footer>
  );
}
