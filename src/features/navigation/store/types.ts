export interface CartItem {
  id: string;
  title: string;
  author: string;
  currentPrice: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  date: string; // ISO string
  status: OrderStatus;
  total: number;
  items: CartItem[];
  paymentMethod: string;
  deliveryNote: string;
}

export interface Address {
  id: string;
  name: string;
  location: string;
  addressLine: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  rating: number;
  comment: string;
  date: string; // ISO string
}

export interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  profile: UserProfile;
  addresses: Address[];
  reviews: BookReview[];
}
