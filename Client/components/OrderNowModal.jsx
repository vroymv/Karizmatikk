import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { CloseX } from "../assets/icons";
import { useGlobalContext } from "../context/GlobalProvider";
import { placeOrder } from "../lib/Node/api";
import { BlurView } from "expo-blur";
import { en, hi } from "../localization/translations";
import Colors from "../lib/Colors";

const OrderNowModal = ({ visible, onClose, getStatus }) => {
  const [order, setOrder] = useState("");
  const [numberErrorVisibility, setNumberErrorVisibility] = useState(false);
  const [error, setError] = useState();
  const [placingOrder, setPlacingOrder] = useState(false);

  //Pulling current user
  const { userInfo, setnumberOrders, lang, theme } = useGlobalContext();

  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  function handleOrderEntered(numPairs) {
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(numPairs)) {
      setNumberErrorVisibility(false);
      setOrder(numPairs);
    } else {
      setError("Please enter only numbers.");
      setNumberErrorVisibility(true);
    }
  }

  async function handleSubmit() {
    //Submit Logic
    //Later modify to make it conditional such that it can hold Successfull or Failed
    if (order > 0) {
      setNumberErrorVisibility(false);
      setPlacingOrder(true);
      const status = await placeOrder(userInfo, order);
      onClose();
      if (status.status) {
        setnumberOrders(status.numPendingOrders);
        getStatus("Successfull");
        setPlacingOrder(false);
      }
      setPlacingOrder(false);
    } else {
      setError("Please enter a valid number of pairs.");
      setNumberErrorVisibility(true);
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={30} experimentalBlurMethod className="flex flex-1">
        <View className="flex flex-col w-[90%] h-[324px] bg-primary m-auto py-3 px-6 rounded-xl">
          <View className="flex flex-row justify-end mt-2">
            <TouchableOpacity onPress={onClose}>
              <Image source={CloseX} className="w-30 h-30" />
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-[20px] font-semibold mt-2">
              {translations.screens.orderNow.title}
            </Text>
          </View>
          {numberErrorVisibility && (
            <Text className="text-[#FF4747] text-[14px] mt-3">{error}</Text>
          )}
          <View className="mt-8">
            <Text className="text-[14px] text-[rgb(71,84,103)]">
              {translations.screens.orderNow.shoeNum}
            </Text>
            <TextInput
              maxLength={2}
              placeholder="Number of Pairs"
              onChangeText={handleOrderEntered}
              className="w-full border-[1px] text-[20px] border-[#a7a7aa] py-1 px-2 rounded-lg"
              value={order}
              blurOnSubmit
              enterKeyHint="Order"
              returnKeyLabel="Order"
              inputMode="numeric"
              onSubmitEditing={handleSubmit}
              autoFocus
            />
          </View>
          <View>
            {placingOrder ? (
              <ActivityIndicator size="large" color="#86EFAC" />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                className="w-full bg-[#EB4335] py-3 rounded-xl mt-10"
              >
                <Text className="text-center font-bold text-primary text-[20px]">
                  {translations.screens.orderNow.confirm}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default OrderNowModal;
