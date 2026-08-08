import type { Review } from "@/types";

export interface SidebarBook {
  id: number;
  title: string;
  author: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
}

export const sidebarBooks: SidebarBook[] = [
  {
    id: 1,
    title: "বদ নজরের প্রভাব ও প্রতিকার",
    author: "আবদুল্লাহ ইবনে নাসের",
    price: "১৬০৳",
    oldPrice: "",
    discount: "",
    image: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: 2,
    title: "মুসলিম ঐতিহ্যে রুকইয়া সংস্কৃতি",
    author: "ড. আবু আমিনাহ বিলাল ফিলিপস",
    price: "৩১৫৳",
    oldPrice: "৪৬০৳",
    discount: "(৩১% ছাড়)",
    image: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: 3,
    title: "খাদ্য ও পুষ্টিতে মহানবী হযরত মুহা...",
    author: "প্রফেসর কামাল উদ্দিন আল মাহমুদ",
    price: "২৭০৳",
    oldPrice: "৫০০৳",
    discount: "(৪৬% ছাড়)",
    image: "/book_cover_img/book_cover_img.webp",
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "এই বইটি সবার থাকা উচিত।",
    author: "Fariha Zannat",
    date: "January 4, 2026",
  },
  {
    id: 2,
    rating: 5,
    comment:
      "আলহামদুলিল্লাহ,এরকম একটা বই এর জন্য খুব আন হওয়ার পর থেকে অপেক্ষা করছিলাম। ভকতেরা আল্লাহর যে এরকম একটা বই উপহার দিয়েছেন,পারিবারিক ভাবে ছোট বেলা থেকে ব্ল্যাক ম্যাজিকের সাথে লড়াই করতে করতে ক্লান্ত আমরা সবাই। বইটা সবার অনেক বেশি সহায়ক হবে ইনশাআল্লাহ।",
    author: "arzuman ara emu",
    date: "September 7, 2024",
  },
  {
    id: 3,
    rating: 5,
    comment:
      "আলহামদুলিল্লাহ বইটি হাতে পেয়েছি আশা করি বইটি আমার জন্য অনেক উপকারী এবং ফায়দা জনক হবে(ইন শা আল্লাহ)।",
    author: "Mis Shamima",
    date: "April 23, 2024",
  },
  {
    id: 4,
    rating: 5,
    comment: "❤️",
    author: "hossainasif137",
    date: "March 5, 2024",
  },
  {
    id: 5,
    rating: 5,
    comment:
      "Allah humma barik. This book help me a lot, Alhamdulillah. Complete guidelines of Ruqyah.",
    author: "Iyaad",
    date: "July 12, 2023",
  },
];

export const starDistribution = [
  { star: 5, count: 6 },
  { star: 4, count: 0 },
  { star: 3, count: 0 },
  { star: 2, count: 0 },
  { star: 1, count: 0 },
];
