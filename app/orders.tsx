import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Header from "../components/Header";
import DeliveryMap from "../components/DeliveryMap";
import { useOrders } from "../context/OrdersContext";
import { makeCall } from "../utils/helpers";
import { OrderStatus } from "../types/Order";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-600",
  assigned: "text-blue-600",
  on_way: "text-orange-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  assigned: "تم تعيين السائق",
  on_way: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export default function Orders() {
  const { orders } = useOrders();
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

  const handleDriverCall = (phone?: string) => {
    if (phone) makeCall(phone);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4">الطلبات</Text>

        {orders.length === 0 ? (
          <Text>لا توجد طلبات حالياً.</Text>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white rounded-lg p-4 mb-3 shadow"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold">طلب #{order.id}</Text>
                <Text className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleString("ar-EG")}
                </Text>
              </View>

              {/* Map view for active deliveries */}
              {order.status === "on_way" &&
                order.driverLocation &&
                locationPermission && (
                  <DeliveryMap
                    order={order}
                    driverLocation={order.driverLocation}
                  />
                )}

              {/* Driver info */}
              {order.driverName && (
                <View className="bg-blue-50 rounded-lg p-3 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="person" size={16} color="#2563eb" />
                      <Text className="mr-2 text-blue-600">
                        {order.driverName}
                      </Text>
                    </View>
                    {order.driverPhone && (
                      <TouchableOpacity
                        onPress={() => handleDriverCall(order.driverPhone)}
                        className="flex-row items-center"
                      >
                        <Ionicons name="call" size={16} color="#2563eb" />
                        <Text className="mr-2 text-blue-600">اتصل بالسائق</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {order.estimatedDeliveryTime && (
                    <Text className="text-sm text-blue-600 mt-1">
                      وقت التوصيل المتوقع: {order.estimatedDeliveryTime}
                    </Text>
                  )}
                </View>
              )}

              {/* Order items */}
              <View className="mb-2">
                {order.items.map((item, idx) => (
                  <View
                    key={`${order.id}-${idx}`}
                    className="flex-row justify-between"
                  >
                    <Text className="text-sm">{item.product?.name}</Text>
                    <Text className="text-sm text-green-600">
                      {(item.product?.price || 0) * item.quantity} جنيه
                    </Text>
                  </View>
                ))}
              </View>

              {/* Order summary */}
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <Text className="font-bold text-green-600">
                  المجموع: {order.total} جنيه
                </Text>
                <Text className={`text-sm ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
