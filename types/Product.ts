export interface Review {
  id: string;
  rating: number; // 1-5 stars
  comment: string;
  reviewerName: string;
  date: string; // ISO string
}

export interface Product {
 id: string | number;
  name?: string;
  title?: string;
  price: number;
  unit?: string;
 image?: string;
  images?: Array<{url: string}>;
  mainImage?: {url: string};
  rating?: number;
  seller?: string;
  sellerId?: string;
  sellerImage?: string;
  village?: string;
  villageId?: string;
  phone?: string;
  category?: string;
  categoryId?: string;
  inStock?: boolean;
  isAvailable?: boolean;
  availabilityStatus?: string;
  description?: string;
  shortDescription?: string;
  reviews?: Review[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  currency?: string;
  condition?: string;
  type?: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  deliveryFee?: number;
  deliveryOptions?: {
    pickup: boolean;
    delivery: boolean;
    shipping: boolean;
  };
  acceptsBarter?: boolean;
  barterItems?: string[];
  views?: number;
  likes?: number;
  shares?: number;
  inquiries?: number;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  lastViewedAt?: string;
  discountPercentage?: number;
  isExpired?: boolean;
  minOrderQuantity?: number;
  quantity?: number;
  priceNegotiable?: boolean;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  slug?: string;
  paymentMethods?: string[];
  keywords?: string[];
}
