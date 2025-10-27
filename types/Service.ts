import { Review } from "./Product";

export interface Service {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  unit?: string;
  provider?: string;
  providerId?: string;
  providerImage?: string;
  phone?: string;
  village?: string;
  villageId?: string;
  category?: string;
  categoryId?: string;
  icon?: string;
  available?: boolean;
  isAvailable?: boolean;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  pricing?: {
    type: string;
    amount: number;
    currency: string;
    minAmount?: number;
    maxAmount?: number;
  };
  priceNegotiable?: boolean;
  images?: Array<{url: string}>;
  mainImage?: {url: string};
  duration?: {
    estimated: string;
    unit: string;
    value: number;
 };
  serviceType?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  address?: string;
  serviceArea?: {
    radius: number;
  };
  experience?: {
    years: number;
    description?: string;
  };
  qualifications?: Array<{
    title: string;
    institution?: string;
    year?: number;
    verified?: boolean;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    verified?: boolean;
    image?: {
      public_id: string;
      url: string;
    };
  }>;
  requirements?: string[];
  includes?: string[];
  excludes?: string[];
  paymentMethods?: string[];
  acceptsInstallments?: boolean;
  installmentOptions?: Array<{
    months: number;
    interestRate: number;
  }>;
  views?: number;
  likes?: number;
  shares?: number;
  inquiries?: number;
  bookings?: number;
  completedJobs?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  reviews?: Review[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastViewedAt?: string;
}

export default Service;
