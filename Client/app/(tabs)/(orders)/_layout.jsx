import React from "react";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { en, hi } from "../../../localization/translations";
import { useGlobalContext } from "@/context/GlobalProvider";
import Colors from "@/lib/Colors";

function _layout() {
  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: AppTheme.themeColor,
        }}
        className="flex justify-center pl-3"
      >
        <Text
          style={{
            color: AppTheme.text,
          }}
          className="text-[40px] h-fit font-semibold"
        >
          {translations.screens.pendingOrders.title}
        </Text>
      </SafeAreaView>
      <Stack>
        <Stack.Screen
          name="(toptabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

export default _layout;
