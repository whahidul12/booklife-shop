export interface CartItem {
  id: string;
  title: string;
  author?: string;
  currentPrice: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string;
}

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "cart-1",
    title: "ঈমানী হৃদয়ের ইবাদতনামা",
    currentPrice: 105,
    originalPrice: 140,
    quantity: 1,
    imageUrl: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: "cart-2",
    title: "ছাত্রত্ব",
    currentPrice: 280,
    originalPrice: 400,
    quantity: 1,
    imageUrl: "/book_cover_img/book_cover_img.webp",
  },
  {
    id: "cart-3",
    title: "বিল্ডিং এ সেকেন্ড ব্রেইন",
    currentPrice: 290,
    originalPrice: 350,
    quantity: 1,
    imageUrl: "/book_cover_img/book_cover_img.webp",
  },
];
