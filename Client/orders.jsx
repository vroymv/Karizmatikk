import { Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import React from "react";
import { MoodEmpty } from "./assets/icons";
import { ordersPendingDelivery } from "./constants";
import { Timer } from "./assets/icons";
import { SafeAreaView } from "react-native-safe-area-context";

function OrdersUnavailable() {
  return (
    <View className="flex flex-col">
      <Image source={MoodEmpty} className="w-[40px] h-[40px]" />
      <Text className="text-center">No orders booked... yet!</Text>
      <Text className="">Place an order to be able to track orders</Text>
      <TouchableOpacity className="">
        <Text className="text-primary">Order Now</Text>
      </TouchableOpacity>
    </View>
  );
}

function OrderItem({ item }) {
  return (
    <View className="flex flex-row items-center justify-center gap-3 my-2">
      <View className="h-[90px] w-[70px]">
        <Image source={item.image} className="w-full h-full rounded-[13px]" />
      </View>
      <Text className="text-[15px]">{item.date}</Text>
      <Text className="text-[69px] text-[#706B6B]">{item.quantity}</Text>
      <View className="flex flex-col justify-center items-center">
        <Image source={Timer} className="w-[20px] h-[20px]" />
        <Text className="text-[#EB4335]">{item.status}</Text>
      </View>
    </View>
  );
}

function OrdersAvailbe() {
  return (
    <View className="flex flex-col">
      <View className="flex flex-row">
        <TouchableOpacity className="bg-secondary px-4 py-2 rounded-2xl">
          <Text className="text-primary text-[13px]">Pending Deliver</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#F3F0F0] px-4 py-2 rounded-2xl">
          <Text className="text-secondary text-[13px] ">Pending Pickup</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={ordersPendingDelivery}
        renderItem={({ item }) => <OrderItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const orders = () => {
  const availableOrders = true;
  return (
    <SafeAreaView className="flex flex-1 flex-col bg-primary px-3">
      <View className="mb-3 mt-2">
        <Text className="text-[40px] font-semibold">Pending Order...</Text>
        <View className="border-b-2 border-[#E1D9D9] w-full mt-2" />
      </View>
      <View className="px-1">
        {availableOrders ? <OrdersAvailbe /> : <OrdersUnavailable />}
      </View>
    </SafeAreaView>
  );
};

export default orders;
