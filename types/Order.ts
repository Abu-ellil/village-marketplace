import { CartItem } from "./CartItem";

export type OrderStatus =
  | "pending"
  | "assigned"
  | "on_way"
  | "delivered"
  | "cancelled";

export interface DriverLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number; // meters per second
}

export interface RoutePoint extends DriverLocation {
  distanceToDestination: number; // meters
}

export interface DeliveryRoute {
  points: RoutePoint[];
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  estimatedDuration: number; // seconds
  distance: number; // meters
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  driverLocation?: DriverLocation;
  driverName?: string;
  driverPhone?: string;
  estimatedDeliveryTime?: string;
  route?: DeliveryRoute;
  lastEta?: {
    time: string;
    remainingMinutes: number;
  };
  deliveryStatus?: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryAddress?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notifiedProximity?: boolean;
}

export default Order;
