import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Close, CloseDark } from "../assets/icons";
import { PhonePeQR } from "../assets/images";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { Audio } from "expo-av";

import Colors from "../lib/Colors.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

const Appreciation = ({ visible, onCloseAppreciationModal }) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  const [sound, setSound] = useState();

  if (status === null) {
    requestPermission();
  }

  const { theme } = useGlobalContext();
  const AppTheme = theme === "dark" ? Colors.dark : Colors.light;

  async function saveQR() {
    try {
      playSound();
      const localUri = await captureRef(imageRef, {
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        console.log("QR saved");
        onCloseAppreciationModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/camera.mp3")
    );
    setSound(sound);

    await sound.playAsync();

    useEffect(() => {
      return sound
        ? () => {
            console.log("Unloading Sound");
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCloseAppreciationModal}
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
            onPress={onCloseAppreciationModal}
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
        <View
          ref={imageRef}
          collapsable={false}
          style={{
            backgroundColor: "white",
            elevation: 10, // For Android
            shadowColor: "#000", // For iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          className="flex items-center justify-center px-2 py-4 rounded-xl w-[90%] bg-[#EFEFEF] mx-auto mt-3"
        >
          <Image source={PhonePeQR} className="" />
        </View>
        <TouchableOpacity
          onPress={saveQR}
          className="w-[80%] mt-16 mx-auto py-2 bg-ktagline rounded-md"
        >
          <Text className="text-primary w-full text-center text-[16px] font-semibold">
            Save to Gallery
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default Appreciation;
