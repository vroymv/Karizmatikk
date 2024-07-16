import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Chevron } from "../../assets/icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { getOurWork } from "../../lib/Node/api";
import GestureRecognizer from "react-native-swipe-gestures";
import { en, hi } from "../../localization/translations";
import { useGlobalContext } from "../../context/GlobalProvider";
import Colors from "../../lib/Colors";

const ourwork = () => {
  const [workInfo, setWorkInfo] = useState({});
  const images = [
    { uri: workInfo.image1?.imgUrl },
    { uri: workInfo.image2?.imgUrl },
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  //get router params
  const params = useLocalSearchParams();

  useEffect(() => {
    async function getImage() {
      const imgUrl = await getOurWork(params.id);
      setWorkInfo(imgUrl[0]);
    }

    getImage();
  }, []);

  //Swipe functions
  const onSwipeLeft = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const onSwipeRight = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: AppTheme.themeColor,
        }}
        className="flex flex-1 flex-col"
      >
        <View className="flex flex-1 items-center justify-center">
          {workInfo.image1?.imgUrl ? (
            <GestureRecognizer
              onSwipeLeft={onSwipeLeft}
              onSwipeRight={onSwipeRight}
              className="w-full h-full"
            >
              <Image
                source={{ uri: images[currentImageIndex].uri }}
                className="w-full h-full"
              />
            </GestureRecognizer>
          ) : (
            <ActivityIndicator size="large" color="#86EFAC" />
          )}
          <TouchableOpacity
            className="absolute top-[10%] left-[5%]"
            onPress={() => router.back()}
          >
            <Image source={Chevron} className="w-[px] h-[px] " />
          </TouchableOpacity>

          <View className="absolute bottom-[10%] right-[5%] bg-transparent bg-black px-3 py-1 rounded-lg">
            <Text className="text-primary text-xl font-bold">
              {currentImageIndex + 1} / 2
            </Text>
          </View>
        </View>
        <View className="flex flex-1">
          <Text
            style={{ color: AppTheme.text }}
            className="text-[40px] font-semibold mt-3 text-center"
          >
            {workInfo.brand}
          </Text>
          <Text
            style={{ color: AppTheme.text }}
            className="text-[16px] font-extralight w-[60%] ml-[10%] mt-5 leading-6"
          >
            {translations.screens.ourWork.body}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ourwork;
