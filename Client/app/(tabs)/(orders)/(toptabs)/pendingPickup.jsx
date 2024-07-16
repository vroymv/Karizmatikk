import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Shoes } from "../../../../assets/icons/index.js";
import { MoodEmpty } from "../../../../assets/icons/index.js";
import OrderNowModal from "../../../../components/OrderNowModal.jsx";
import OrderCompleteModal from "../../../../components/OrderCompleteModal.jsx";
import { useGlobalContext } from "../../../../context/GlobalProvider.js";
import { getOrders } from "../../../../lib/Node/api.js";
import { formatTimestamp } from "../../../../utils/index.js";
import { en, hi } from "../../../../localization/translations";
import Colors from "../../../../lib/Colors.js";

function OrdersUnavailable() {
  const [orderModalVisible, setOrderModalVisible] = useState(false); //Order Now Modal
  const [orderCompleteVisible, setOrderCompleteVisible] = useState(false); //Successfull order placed modal

  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  //Opening Order Now Modal
  function handleOrderPress() {
    setOrderModalVisible(true);
  }

  //Closing Order Now Modal
  function closeOrderNowModal() {
    setOrderModalVisible(false);
  }

  //Opening Order Complete Modal
  function handleOrderComplete() {
    setOrderCompleteVisible(true);
  }

  //Closing Order Complete Modal
  function closeOrderComplete() {
    setOrderCompleteVisible(false);
  }

  function handleReturnedStatus(data) {
    if (data === "Successfull") {
      closeOrderNowModal();
      handleOrderComplete();
    }
  }

  return (
    <View className="flex h-full flex-col items-center pt-[10%]">
      <Image source={MoodEmpty} className="w-[40px] h-[40px] mt-5" />
      <Text
        style={{
          color: AppTheme.text,
        }}
        className="text-center text-[20px] font-medium mt-4"
      >
        {translations.screens.pendingOrders.noOrders.title}
      </Text>
      <Text
        style={{
          color: AppTheme.text,
        }}
        className="text-[16px] font-extralight mt-8 w-[60%]"
      >
        {translations.screens.pendingOrders.noOrders.body}
      </Text>
      <TouchableOpacity
        onPress={handleOrderPress}
        className="bg-[#EB4335] rounded-xl px-6 py-2 mt-12"
      >
        <Text className="text-primary text-[24px] font-medium">
          {translations.screens.pendingOrders.noOrders.button}
        </Text>
      </TouchableOpacity>

      <OrderNowModal
        getStatus={handleReturnedStatus}
        visible={orderModalVisible}
        onClose={closeOrderNowModal}
      />
      <OrderCompleteModal
        visible={orderCompleteVisible}
        onClose={closeOrderComplete}
      />
    </View>
  );
}

function OrderItem({ item }) {
  const { theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  const time = formatTimestamp(item.orderTime);
  return (
    <View className="flex mx-auto my-6">
      <View className="flex flex-row gap-3">
        <View className="flex h-[90px] w-[70px]">
          <Image
            source={Shoes}
            className="w-full h-full rounded-[13px] object-contain border-[1px] border-green-300"
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
              <Text
                style={{
                  color: AppTheme.text,
                }}
                className="text-[15px]"
              >
                Pickup time
              </Text>
              <Text className="text-[#EB4335]">tonight - 10pm</Text>
            </View>
          </View>
          <View className="border-b-2 border-[#E1D9D9] w-full" />
        </View>
      </View>
    </View>
  );
}

function OrdersAvailbe({
  availableOrders,
  isLoadingOrders,
  setIsLoadingOrders,
  callOrders,
}) {
  const onRefresh = React.useCallback(() => {
    setIsLoadingOrders(true);
    callOrders();
  }, []);

  return (
    <View className="flex h-full">
      <FlatList
        data={availableOrders}
        renderItem={({ item }) => <OrderItem item={item} />}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => <OrdersUnavailable />}
        refreshControl={
          <RefreshControl refreshing={isLoadingOrders} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const pendingOrders = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const { userInfo, theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  async function pullOrders() {
    try {
      setIsLoadingOrders(true);
      const orders = await getOrders(userInfo._id, "pendingpickup");
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
        <OrdersAvailbe
          callOrders={pullOrders}
          isLoadingOrders={isLoadingOrders}
          availableOrders={availableOrders}
          setIsLoadingOrders={setIsLoadingOrders}
        />
      )}
    </View>
  );
};

export default pendingOrders;
