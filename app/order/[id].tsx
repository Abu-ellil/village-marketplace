import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOrders } from '../../context/OrdersContext';
import Header from '../../components/Header';
import DeliveryMap from '../../components/DeliveryMap';
import { OrderStatus } from '../../types/Order';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-600',
  assigned: 'text-blue-600',
  on_way: 'text-orange-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  assigned: 'تم تعيين السائق',
  on_way: 'في الطريق',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View>
        <Header />
        <Text className="p-4 text-center">الطلب غير موجود</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white rounded-lg p-4 mb-3 shadow">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-bold">طلب #{order.id}</Text>
            <Text className="text-sm text-neutral-500">
              {new Date(order.createdAt).toLocaleString('ar-EG')}
            </Text>
          </View>

          {order.status === 'on_way' && order.driverLocation && (
            <DeliveryMap order={order} driverLocation={order.driverLocation} />
          )}

          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <Text className="font-bold text-green-600">
              المجموع: {order.total} جنيه
            </Text>
            <Text className={`text-sm ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
