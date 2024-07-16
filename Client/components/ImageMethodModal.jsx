import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

const ImageMethodModal = ({
  visible,
  onCloseImageMethod,
  onChoosePhoto,
  onTakePhoto,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCloseImageMethod}
    >
      <View className="flex flex-col w-[60%] h-[15%] bg-slate-400 m-auto rounded-xl py-3 items-center">
        <TouchableOpacity
          className="flex w-full items-center"
          onPress={onTakePhoto}
        >
          <Text className="text-[20px] my-2">Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex w-full items-center"
          onPress={onChoosePhoto}
        >
          <Text className="text-[20px] ">Choose Photo</Text>
        </TouchableOpacity>
        <View className="border-b-2 border-[#E1D9D9] w-full" />
        <TouchableOpacity
          onPress={onCloseImageMethod}
          className="flex w-full items-center"
        >
          <Text className="text-[15px] mt-3">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImageMethodModal;
