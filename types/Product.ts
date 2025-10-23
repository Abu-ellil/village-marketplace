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
}
