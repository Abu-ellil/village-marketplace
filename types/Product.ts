export interface Review {
  id: string;
  rating: number; // 1-5 stars
  comment: string;
  reviewerName: string;
  date: string; // ISO string
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  unit?: string;
  image?: string;
  rating?: number;
  seller?: string;
  village?: string;
  phone?: string;
  category?: string;
  inStock?: boolean;
  description?: string;
  reviews?: Review[];
}
