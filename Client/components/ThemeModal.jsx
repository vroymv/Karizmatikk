import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

const ThemeModal = ({
  visible,
  onCloseThemeModal,
  onChooseDark,
  onChooseLight,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCloseThemeModal}
    >
      <View className="flex flex-col w-[60%] h-[15%] bg-white m-auto rounded-xl py-3 items-center">
        <TouchableOpacity
          className="flex w-full items-center"
          onPress={onChooseDark}
        >
          <Text className="text-[20px] my-2">Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex w-full items-center"
          onPress={onChooseLight}
        >
          <Text className="text-[20px] ">Light</Text>
        </TouchableOpacity>
        <View className="border-b-2 border-[#E1D9D9] w-full" />
        <TouchableOpacity
          onPress={onCloseThemeModal}
          className="flex w-full items-center"
        >
          <Text className="text-[15px] mt-3">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ThemeModal;
