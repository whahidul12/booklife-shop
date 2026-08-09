export interface WishlistItem {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
}

export interface Address {
  id: number;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
}
