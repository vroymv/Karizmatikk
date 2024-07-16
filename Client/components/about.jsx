import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Close, CloseDark, Down, Up } from "../assets/icons";
import { useState } from "react";
import {
  Message1,
  Order1,
  Shoes2,
  ShoesLandscape,
  ShoesPortrait,
} from "../assets/images/index.js";
import Carousel from "react-native-reanimated-carousel";
import ModalView from "../components/ModalView.jsx";
import Colors from "../lib/Colors.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

//Accordian component
function Accordian({ title, body }) {
  const [accordianVisibility, setAccordianVisibility] = useState(false);
  const { theme } = useGlobalContext();
  const AppTheme = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <>
      <View className="flex flex-col my-4 px-6">
        <View className="">
          <TouchableOpacity
            onPress={() => setAccordianVisibility(!accordianVisibility)}
            className="flex flex-row justify-between"
          >
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[20px] font-light w-[70%]"
            >
              {title}
            </Text>
            <Image
              style={{
                tintColor: AppTheme.text,
              }}
              source={accordianVisibility ? Up : Down}
            />
          </TouchableOpacity>
        </View>
        {accordianVisibility && (
          <View className="ml-10 mt-2">
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[16px] font-extralight"
            >
              {body}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          borderColor: AppTheme.dividerLine,
        }}
        className="border-b-2 w-full ml-6"
      />
    </>
  );
}

const AboutModal = ({ visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldMarkAllRead, setShouldMarkAllRead] = useState(false);
  const { theme } = useGlobalContext();
  const AppTheme = theme === "dark" ? Colors.dark : Colors.light;
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          backgroundColor: AppTheme.themeColor,
        }}
        className="flex mt-[20%] justify-center rounded-t-xl p-2"
      >
        <View className="flex flex-row justify-between w-full p-2">
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-[20px] font-bold"
          >
            Karizmatik<Text className="text-[#27B08B]">.</Text>
          </Text>
          <TouchableOpacity
            className="w-[30px] h-[30px] rounded-full"
            onPress={onClose}
          >
            <Image
              source={theme === "dark" ? CloseDark : Close}
              className="w-full h-full rounded-full"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderColor: AppTheme.dividerLine,
          }}
          className="border-b-2 w-full"
        />
      </View>

      <ScrollView
        style={{
          backgroundColor: AppTheme.themeColor,
        }}
      >
        <View className="flex flex-col mt-6 w-[80%] mx-auto">
          <Text
            style={{
              color: AppTheme.text,
            }}
            className=" text-[24px] font-light"
          >
            You're just a few steps away from making your shoes clean again
          </Text>
        </View>

        <Carousel
          width={400}
          loop
          height={230}
          autoPlay={true}
          data={[ShoesLandscape, ShoesPortrait, Shoes2]}
          scrollAnimationDuration={1000}
          renderItem={function ({ item }) {
            return (
              <View className="w-[70%] h-[70%] mx-auto mt-4">
                <Image
                  source={item}
                  className="w-full h-full rounded-3xl object-contain"
                />
              </View>
            );
          }}
        />

        <View className="flex flex-col">
          <View className="w-[60%] ml-10">
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[32px] font-semibold"
            >
              1. Order
            </Text>
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[16px] font-extralight ml-8"
            >
              Placing an order is as easy as it gets
            </Text>
          </View>
          <Image source={Order1} className="w-full mt-3" />
        </View>

        <View className="flex flex-col mt-8">
          <View className="w-[60%] ml-10">
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[32px] font-semibold"
            >
              2. Message
            </Text>
            <Text
              style={{
                color: AppTheme.text,
              }}
              className="text-[16px] font-extralight ml-8"
            >
              You could always reach us
            </Text>
          </View>
          <Image source={Message1} className="w-full mt-3" />
        </View>

        <View className=" ">
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-[24px] font-semibold mt-8 ml-6"
          >
            Still have questions?
          </Text>

          <Accordian
            title="How long does it take to return my shoes"
            body="Usally it takes 1 day, with delays it could take 2 days."
          />
          <Accordian
            title="When do I make Payment"
            body="At the time of delivery"
          />
          <Accordian
            title="How many shoes can i give? "
            body="Just place an order, we will pick up from your hostel"
          />
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="w-[80%] mb-[100px] mt-6 mx-auto py-2 bg-ktagline rounded-md"
        >
          <Text className="text-primary w-full text-center text-[16px] font-semibold">
            Talk to us
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <ModalView
        visible={modalVisible}
        onClose={closeModal}
        unread={setUnreadCount}
        shouldMarkAllRead={shouldMarkAllRead}
      />
    </Modal>
  );
};

export default AboutModal;
