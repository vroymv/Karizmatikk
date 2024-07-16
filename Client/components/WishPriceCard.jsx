import { View, Text, Image } from "react-native";
import React from "react";
import icon from "../assets/images/icon.png";
import Colors from "../lib/Colors";
import { useGlobalContext } from "../context/GlobalProvider";

const WishPriceCard = ({ image, message }) => {
  const { theme } = useGlobalContext();
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <View
      style={{
        backgroundColor: AppTheme.wishCardBg,
      }}
      className="flex flex-col w-[90%] h-[375px] mt-[10%] border-[1px] rounded-3xl mx-auto"
    >
      <Image
        source={image ? { uri: image } : icon}
        className="w-full h-[294px] rounded-t-2xl"
      />
      <View className="p-3">
        {message ? (
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-[20px]"
          >
            {message}
          </Text>
        ) : (
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-[20px]"
          >
            Get your Shoe Clean{"\n"} at{" "}
            <Text className="text-[#EB4335]">{"\u20B9"}49</Text>{" "}
            <Text> Only</Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default WishPriceCard;
