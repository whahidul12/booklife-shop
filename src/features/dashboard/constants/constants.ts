import {
  User,
  ShoppingBag,
  Heart,
  Star,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import type { SidebarNavItem } from "@/types";

export const sidebarNavItems: SidebarNavItem[] = [
  { title: "Account Settings", href: "/account", icon: User },
  { title: "Orders", href: "/account/orders", icon: ShoppingBag },
  { title: "Wishlist", href: "/account/wishlist", icon: Heart },
  { title: "Review", href: "/account/reviews", icon: Star },
  { title: "Address", href: "/account/address", icon: MapPin },
  { title: "Change Password", href: "/account/change-password", icon: Settings },
  // Logout is rendered separately in AccountSidebar via a form action
  { title: "Logout", href: "/", icon: LogOut },
];

export const wishlistItems = [
  {
    id: 1,
    title: "নতুন বাংলাদেশের আদ্যোপান্ত",
    price: "৩২৯ ৳",
    oldPrice: "৪৫০ ৳",
    discount: "(২৭% ছাড়ে)",
    image: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: 2,
    title: "শাপলানামা (তেরো থেকে তেইশ)",
    price: "৪৫০ ৳",
    oldPrice: "",
    discount: "",
    image: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: 3,
    title: "ইতিহাসের মহাবীর আরতুগ্রুল",
    price: "৩৩০ ৳",
    oldPrice: "৬০০ ৳",
    discount: "(৪৫% ছাড়ে)",
    image: "/book_cover_img/book_cover_img.webp",
  },
];
