import { NavLink } from "../types/navbar.type";

export const navLinks: NavLink[] = [
  { label: "হোম", href: "/" },
  {
    label: "বই",
    href: "#",
    children: [
      { label: "জেনারেল বই", href: "/books/general" },
      { label: "একাডেমিক", href: "/books/academic" },
      { label: "আরবি বই", href: "/books/arabic" },
    ],
  },
  { label: "বিষয়", href: "/subjects" },
  { label: "লেখক", href: "/authors" },
  { label: "প্রকাশক", href: "/publishers" },
  { label: "আজকের অফার", href: "/online-book-fair" },
  { label: "প্রি-অর্ডার", href: "/preorder" },
  { label: "গ্যাজেট", href: "/comming-soon" },
  { label: "কর্পোরেট", href: "/corporate" },
];
