import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GlobalProvider from "../context/GlobalProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const _layout = () => {
  const [fontsLoaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    Overpass: require("../assets/fonts/Overpass-VariableFont_wght.ttf"),
    Jaldi: require("../assets/fonts/Jaldi-Bold.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    Inter: require("../assets/fonts/Inter-VariableFont_slnt,wght.ttf"),
    Asap: require("../assets/fonts/Asap-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(zstacks)" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalProvider>
  );
};

export default _layout;
