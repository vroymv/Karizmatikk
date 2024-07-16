import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import OurWorkItem from "../../components/OurWorkItem";
import { OrderNow, Bell } from "../../assets/icons/index";
import ModalView from "../../components/ModalView.jsx";
import WishPriceCard from "../../components/WishPriceCard.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderNowModal from "../../components/OrderNowModal";
import OrderCompleteModal from "../../components/OrderCompleteModal.jsx";
import { getOurWork, getWishes } from "../../lib/Node/api.js";
import { useGlobalContext } from "../../context/GlobalProvider.js";
import { Redirect } from "expo-router";
import PushNotificationsMount from "../../components/Push.tsx";
import Colors from "../../lib/Colors.js";

const home = () => {
  const [ourWork, setOurWork] = useState();
  const [loadingOurWork, setloadingOurWork] = useState(false);
  const [wishes, setWishes] = useState();
  const [loadingWishes, setloadingWishes] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); //Messages modal
  const [orderModalVisible, setOrderModalVisible] = useState(false); //Order Now Modal
  const [orderCompleteVisible, setOrderCompleteVisible] = useState(false); //Successfull order placed modal
  const { isAuthenticated, userInfo, theme } = useGlobalContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldMarkAllRead, setShouldMarkAllRead] = useState(false);

  // console.log(Colors.dark.commonBlack);

  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)"} />;
  }

  //Get our work
  async function getourwork() {
    try {
      setloadingOurWork(true);
      const data = await getOurWork();
      setOurWork(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloadingOurWork(false);
    }
  }

  //Get wishes
  async function getwishes() {
    try {
      setloadingWishes(true);
      const data = await getWishes();
      setWishes(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloadingWishes(false);
    }
  }

  //Handle Refreshing
  const onRefreshOurWork = React.useCallback(() => {
    setloadingOurWork(true);
    getourwork();
  }, []);

  const onRefreshWishes = React.useCallback(() => {
    setloadingWishes(true);
    getwishes();
  }, []);

  useEffect(() => {
    getwishes();
    getourwork();
  }, []);

  //Opening Messages Modal
  const openModal = () => {
    setUnreadCount(0); //Marking as viewed
    setShouldMarkAllRead(true);
    setModalVisible(true);
  };

  //Closing Messages Modal
  const closeModal = () => {
    setModalVisible(false);
  };

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
    <SafeAreaView
      style={{ backgroundColor: AppTheme.themeColor }}
      className={`flex flex-1 items-center`}
    >
      <View className="flex flex-row justify-between w-full items-center px-4">
        <View>
          <Text
            style={{ color: AppTheme.text }}
            className={`text-[40px] font-bold`}
          >
            Karizmatik<Text className="text-[#27B08B]">.</Text>
          </Text>
        </View>
        <View>
          <TouchableOpacity className="w-[30px] h-[30px]" onPress={openModal}>
            <View className="flex items-center justify-center w-[20px] h-[20px] absolute top-[-13px] left-[-3px] bg-ktagline rounded-full">
              <Text className="text-white ">{unreadCount}</Text>
            </View>
            <Image
              source={Bell}
              className="w-full h-full"
              tintColor={`${AppTheme.text}`}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{ borderColor: AppTheme.dividerLine }}
        className="flex justify-center items-center border-b-[5px] h-[130px] drop-shadow-xl"
      >
        {loadingOurWork ? (
          <ActivityIndicator size="small" color="#86EFAC" />
        ) : (
          <FlatList
            data={ourWork}
            renderItem={({ item }) => (
              <OurWorkItem id={item._id} image={item.image1.imgUrl} />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loadingOurWork}
                onRefresh={onRefreshOurWork}
              />
            }
            ListFooterComponent={() => <View className="w-10"></View>}
          />
        )}
      </View>

      <PushNotificationsMount userId={userInfo._id} />

      {loadingWishes ? (
        <ActivityIndicator size="small" color="#86EFAC" />
      ) : (
        <FlatList
          className="w-full"
          data={wishes}
          renderItem={({ item }) => (
            <WishPriceCard
              image={item.messageImage?.imgUrl}
              message={item?.message}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loadingWishes}
              onRefresh={onRefreshWishes}
            />
          }
        />
      )}

      <TouchableOpacity
        onPress={handleOrderPress}
        className="absolute top-[95%] left-[80%]"
      >
        <Image source={OrderNow} />
      </TouchableOpacity>

      <ModalView
        visible={modalVisible}
        onClose={closeModal}
        unread={setUnreadCount}
        shouldMarkAllRead={shouldMarkAllRead}
      />
      <OrderNowModal
        getStatus={handleReturnedStatus}
        visible={orderModalVisible}
        onClose={closeOrderNowModal}
      />
      <OrderCompleteModal
        visible={orderCompleteVisible}
        onClose={closeOrderComplete}
      />
    </SafeAreaView>
  );
};

export default home;
