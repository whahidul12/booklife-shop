export interface FooterLink {
  label: string;
  href: string;
}

export const USEFUL_LINKS: FooterLink[] = [
  { label: "যোগাযোগ করুন", href: "/contact" },
  { label: "শপিং ব্যাগ", href: "/cart" },
  { label: "প্রশ্নোত্তর", href: "/faq" },
  { label: "কীভাবে কেনাকাটা করবেন ?", href: "/how-to-buy" },
  { label: "ক্যারিয়ার", href: "/career" },
  { label: "শর্তাবলী", href: "/terms" },
  { label: "রিফান্ড নীতিমালা", href: "/refund-policy" },
  { label: "প্রাইভেসি পলিসি", href: "/privacy-policy" },
];

export const POPULAR_LINKS: FooterLink[] = [
  { label: "আপনার পছন্দের তালিকা", href: "/wishlist" },
  { label: "জেনারেল ও একাডেমিক বই", href: "/academic-books" },
  {
    label: "ড. খন্দকার আব্দুল্লাহ জাহাঙ্গীর এর বই",
    href: "/authors/dr-khondokar-abdullah-jahangir",
  },
  { label: "আরিফ আজাদ এর বই", href: "/authors/arif-azad" },
  { label: "প্রি-অর্ডার", href: "/pre-order" },
  { label: "প্যাকেজ", href: "/packages" },
  { label: "ইলেকট্রনিক্স", href: "/electronics" },
];

export const CONTACT_INFO = {
  address: "House 310, Road 21 Mohakhali DOHS, Dhaka-1206",
  phone: "096-7877-1365",
  email: "sales@wafilife.com",
};
