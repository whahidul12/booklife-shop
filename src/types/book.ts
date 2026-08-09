export interface Book {
  id: number | string;
  title: string;
  author: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
  href?: string;
}

export interface Publisher {
  id: number;
  name: string;
  logo: string;
  href?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
}
