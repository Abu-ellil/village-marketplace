import { Order } from "../types/Order";

const now = new Date();

export const mockOrders: Order[] = [
  {
    id: `mock-${now.getTime()}-1`,
    items: [],
    total: 120,
    createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
    status: "on_way",
    driverName: "محمد علي",
    driverPhone: "01012345678",
    estimatedDeliveryTime: "25 دقيقة",
    driverLocation: {
      latitude: 30.0455,
      longitude: 31.2367,
      timestamp: new Date().toISOString(),
      speed: 5,
    },
    route: {
      points: [
        {
          latitude: 30.0455,
          longitude: 31.2367,
          timestamp: new Date().toISOString(),
          speed: 5,
          distanceToDestination: 1500,
        },
        {
          latitude: 30.0465,
          longitude: 31.2377,
          timestamp: new Date(Date.now() + 60 * 1000).toISOString(),
          speed: 5,
          distanceToDestination: 1200,
        },
        {
          latitude: 30.0475,
          longitude: 31.2387,
          timestamp: new Date(Date.now() + 120 * 1000).toISOString(),
          speed: 5,
          distanceToDestination: 900,
        },
      ],
      destination: {
        latitude: 30.0485,
        longitude: 31.2397,
        address: "شارع الاختبار",
      },
      estimatedDuration: 20 * 60, // 20 minutes
      distance: 2000,
    },
    lastEta: {
      time: new Date().toISOString(),
      remainingMinutes: 20,
    },
  },
  {
    id: `mock-${now.getTime()}-2`,
    items: [],
    total: 45,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
    status: "delivered",
    driverName: "سعيد",
    driverPhone: "01087654321",
    estimatedDeliveryTime: "تم التسليم",
    driverLocation: undefined,
  },
  {
    id: `mock-${now.getTime()}-3`,
    items: [],
    total: 78,
    createdAt: now.toISOString(),
    status: "pending",
  },
];

export default mockOrders;
