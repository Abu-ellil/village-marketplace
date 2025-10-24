import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { Order } from "../types/Order";

interface DeliveryMapProps {
  order: Order;
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ order, driverLocation }) => {
  // Cairo coordinates as default center
  const defaultRegion = {
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Get the route coordinates if available
  const routeCoordinates = order.route?.points.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={defaultRegion}
          region={
            driverLocation
              ? {
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : defaultRegion
          }
        >
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              title="السائق"
              description={`رقم الطلب: #${order.id}`}
            />
          )}
          {order.route?.destination && (
            <Marker
              coordinate={order.route.destination}
              title="الوجهة"
              pinColor="green"
            />
          )}
          {routeCoordinates && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#2196F3"
              strokeWidth={3}
            />
          )}
        </MapView>
        {order.route && (
          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>
              الوقت المتبقي:{" "}
              {order.lastEta
                ? `${order.lastEta.remainingMinutes} دقيقة`
                : "جاري الحساب..."}
            </Text>
            <Text style={styles.distanceText}>
              المسافة: {Math.round(order.route.distance / 1000)} كم
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  etaContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  etaText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
  },
});

export default DeliveryMap;
