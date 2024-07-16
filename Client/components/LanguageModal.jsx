import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

const LanguageModal = ({
  visible,
  onCloseLangModal,
  onChooseEn,
  onChooseHi,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCloseLangModal}
    >
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        className="flex flex-1 justify-start items-center"
      >
        <View className="flex flex-col w-[60%] h-[15%] bg-white rounded-xl py-3 items-center">
          <TouchableOpacity
            className="flex w-full items-center"
            onPress={onChooseEn}
          >
            <Text className="text-[20px] my-2">English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex w-full items-center"
            onPress={onChooseHi}
          >
            <Text className="text-[20px] ">Hindi</Text>
          </TouchableOpacity>
          <View className="border-b-2 border-[#E1D9D9] w-full" />
          <TouchableOpacity
            onPress={onCloseLangModal}
            className="flex w-full items-center"
          >
            <Text className="text-[15px] mt-3">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;
