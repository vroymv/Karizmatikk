import { View, Modal, TouchableOpacity, Image } from "react-native";
import { CloseX } from "../assets/icons";
import { Check } from "../assets/icons";
import { BlurView } from "expo-blur";

const OrderCompleteModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={30} experimentalBlurMethod className="flex flex-1">
        <View className="flex flex-col bg-primary w-[90%] h-[324px] m-auto py-2 px-4 rounded-xl overflow-hidden">
          <View className="flex flex-row justify-end mt-6">
            <TouchableOpacity onPress={onClose}>
              <Image source={CloseX} className="w-30 h-30" />
            </TouchableOpacity>
          </View>
          <View className="flex items-center">
            <Image source={Check} className="" />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default OrderCompleteModal;
