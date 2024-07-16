import React from "react";
import { SplashScreen, Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getToken } from "../../lib/Storage";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

const _layout = () => {
  const { authIsLoading, isAuthenticated } = useGlobalContext();
  const token = getToken();

  if (authIsLoading) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!authIsLoading && isAuthenticated && token) {
    SplashScreen.hideAsync();
    return <Redirect href={"/(tabs)"} />;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="userAccount" />
      </Stack>
      <StatusBar style="auto" backgroundColor="#000000" />
    </>
  );
};

export default _layout;
