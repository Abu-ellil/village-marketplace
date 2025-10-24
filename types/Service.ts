import { Review } from "./Product";

export interface Service {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  unit?: string;
  provider?: string;
  phone?: string;
  village?: string;
  icon?: string;
  available?: boolean;
  reviews?: Review[];
}

export default Service;
