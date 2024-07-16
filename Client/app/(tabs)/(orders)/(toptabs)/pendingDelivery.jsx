import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
// import { ordersPendingDelivery } from "../../../../constants";
import { Timer } from "../../../../assets/icons";
import { MoodEmpty } from "../../../../assets/icons";
import { useGlobalContext } from "../../../../context/GlobalProvider.js";
import { formatTimestamp } from "../../../../utils/index.js";
import { getOrders } from "../../../../lib/Node/api.js";
import { en, hi } from "../../../../localization/translations";
import Colors from "../../../../lib/Colors.js";

function DeliveryUnavailable() {
  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <View className="flex h-full flex-col items-center pt-[10%]">
      <Image source={MoodEmpty} className="w-[40px] h-[40px] mt-5" />
      <Text
        style={{
          color: AppTheme.text,
        }}
        className="text-center text-[20px] font-medium mt-4"
      >
        {translations.screens.pendingDeliveries.noOrders.title}
      </Text>
      <Text
        style={{
          color: AppTheme.text,
        }}
        className="text-[16px] font-extralight mt-8 w-[60%]"
      >
        {translations.screens.pendingDeliveries.noOrders.body}
      </Text>
    </View>
  );
}

function DeliveryItem({ item }) {
  const time = formatTimestamp(item.orderTime);
  const { theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <View className="flex mx-auto my-6">
      <View className="flex flex-row gap-3">
        <View className="flex h-[90px] w-[70px]">
          <Image
            source={item.image?.imgUrl}
            className="w-full h-full rounded-[13px]"
          />
        </View>
        <View className="flex flex-col">
          <View className="flex flex-row items-center justify-center gap-3">
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[15px] w-[20%] text-center"
            >
              {time}
            </Text>
            <Text className="text-[69px] text-[#706B6B]">
              {item.numberOfShoes}
            </Text>
            <View className="flex flex-col justify-center items-center">
              <Image source={Timer} className="w-[20px] h-[20px]" />
              <Text
                style={{
                  color: AppTheme.text,
                }}
                className="text-[#EB4335] text-[12px]"
              >
                {item.status}
              </Text>
            </View>
          </View>
          <View className="border-b-2 border-[#E1D9D9] w-full" />
        </View>
      </View>
    </View>
  );
}

function DeliveryAvailbe({
  availableOrders,
  isLoadingOrders,
  setIsLoadingOrders,
  callOrders,
}) {
  const { theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  const onRefresh = React.useCallback(() => {
    setIsLoadingOrders(true);
    callOrders();
  }, []);

  return (
    <View className="flex h-full">
      <FlatList
        data={availableOrders}
        renderItem={({ item }) => <DeliveryItem item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <DeliveryUnavailable />}
        refreshControl={
          <RefreshControl refreshing={isLoadingOrders} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const pendingDelivery = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const { userInfo, theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  async function pullOrders() {
    try {
      setIsLoadingOrders(true);
      const orders = await getOrders(userInfo._id, "pendingdelivery");
      setAvailableOrders(orders);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOrders(false);
    }
  }

  useEffect(() => {
    pullOrders();
  }, []);

  return (
    <View
      style={{
        backgroundColor: AppTheme.themeColor,
      }}
      className="px-1"
    >
      {isLoadingOrders ? (
        <View className="flex h-full justify-center items-center bg-primary">
          <ActivityIndicator size="large" color="#EB4335" />
        </View>
      ) : (
        <DeliveryAvailbe
          callOrders={pullOrders}
          isLoadingOrders={isLoadingOrders}
          availableOrders={availableOrders}
          setIsLoadingOrders={setIsLoadingOrders}
        />
      )}
    </View>
  );
};

export default pendingDelivery;
