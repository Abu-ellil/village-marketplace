import { DriverLocation, DeliveryRoute, RoutePoint } from "../types/Order";

// Mock movement within Cairo area
const CAIRO_CENTER = {
  latitude: 30.0444,
  longitude: 31.2357,
};

class MockDriverTrackingService {
  private static instance: MockDriverTrackingService;
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private callbacks: Array<
    (location: DriverLocation, route?: DeliveryRoute) => void
  > = [];
  private route: DeliveryRoute;
  private currentRouteIndex = 0;
  private averageSpeed = 8; // meters per second (about 30 km/h)

  private currentLocation: DriverLocation = {
    latitude: CAIRO_CENTER.latitude,
    longitude: CAIRO_CENTER.longitude,
    timestamp: new Date().toISOString(),
    speed: 0,
  };

  public static calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private constructor() {
    this.route = this.generateMockRoute();
  }

  private generateMockRoute(): DeliveryRoute {
    const points: RoutePoint[] = [];
    const destination = {
      latitude: CAIRO_CENTER.latitude + (Math.random() * 0.02 - 0.01),
      longitude: CAIRO_CENTER.longitude + (Math.random() * 0.02 - 0.01),
    };

    // Generate 8 points along the route
    const startLat = this.currentLocation.latitude;
    const startLng = this.currentLocation.longitude;

    for (let i = 0; i < 8; i++) {
      const progress = (i + 1) / 8;
      const lat = startLat + (destination.latitude - startLat) * progress;
      const lng = startLng + (destination.longitude - startLng) * progress;
      const point: RoutePoint = {
        latitude: lat,
        longitude: lng,
        timestamp: new Date(Date.now() + i * 60 * 1000).toISOString(),
        speed: this.averageSpeed,
        distanceToDestination: this.calculateDistance(
          { latitude: lat, longitude: lng },
          destination
        ),
      };
      points.push(point);
    }

    const totalDistance = this.calculateDistance(
      { latitude: startLat, longitude: startLng },
      destination
    );

    return {
      points,
      destination,
      estimatedDuration: totalDistance / this.averageSpeed,
      distance: totalDistance,
    };
  }

  private calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private updateLocation() {
    if (this.currentRouteIndex < this.route.points.length) {
      const nextPoint = this.route.points[this.currentRouteIndex];
      this.currentLocation = {
        latitude: nextPoint.latitude,
        longitude: nextPoint.longitude,
        timestamp: new Date().toISOString(),
        speed: nextPoint.speed,
      };
      this.currentRouteIndex++;
    } else {
      // When route completes, generate a new route
      this.route = this.generateMockRoute();
      this.currentRouteIndex = 0;
    }
  }

  private notifyCallbacks() {
    this.callbacks.forEach((cb) => cb(this.currentLocation, this.route));
  }

  public static getInstance(): MockDriverTrackingService {
    if (!MockDriverTrackingService.instance) {
      MockDriverTrackingService.instance = new MockDriverTrackingService();
    }
    return MockDriverTrackingService.instance;
  }

  public startTracking(
    callback: (location: DriverLocation, route?: DeliveryRoute) => void
  ) {
    this.callbacks.push(callback);

    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.updateLocation();
        this.notifyCallbacks();
      }, 3000);
    }

    // Send initial location immediately
    callback(this.currentLocation, this.route);
  }

  public stopTracking(
    callback: (location: DriverLocation, route?: DeliveryRoute) => void
  ) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    if (this.callbacks.length === 0 && this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export default MockDriverTrackingService;
