import { Tabs } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { TabNavigationState, ParamListBase } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { en, hi } from "../../../../localization/translations";
import { useGlobalContext } from "@/context/GlobalProvider";
import Colors from "@/lib/Colors";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const _layout = () => {
  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: AppTheme.themeColor,
        },
        tabBarLabelStyle: {
          textTransform: "capitalize",
          color: AppTheme.text,
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="pendingPickup"
        options={{
          title: `${translations.screens.pendingOrders.topTabTitle1}`,
        }}
      />
      <Tabs.Screen
        name="pendingDelivery"
        options={{
          title: `${translations.screens.pendingOrders.topTabTitle2}`,
        }}
      />
    </MaterialTopTabs>
  );
};

export default _layout;
