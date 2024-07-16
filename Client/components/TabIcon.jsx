import React from "react";
import { View, Image } from "react-native";
import Colors from "@/lib/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function TabIcon({ icon, focused }) {
  const { theme } = useGlobalContext();

  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <View className="">
      <Image
        source={icon}
        style={{
          width: 30,
          height: 30,
          tintColor: focused ? "#EB4335" : AppTheme.text,
        }}
      />
    </View>
  );
}
