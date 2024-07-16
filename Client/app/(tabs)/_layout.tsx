import { Redirect, Tabs } from "expo-router";
import TabIcon from "../../components/TabIcon";
import { Home, Orders, Settings } from "../../assets/icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getToken } from "@/lib/Storage";
import Colors from "../../lib/Colors";

const TabLayout = () => {
  const { numberOrders, theme } = useGlobalContext();

  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  const token = getToken();
  if (!token) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EB4335",
        tabBarInactiveTintColor: AppTheme.text,
        tabBarLabelStyle: {
          fontSize: 16,
        },
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E1D9D9",
          backgroundColor: AppTheme.themeColor,
          paddingTop: 10,
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          //hide title

          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Home} />
          ),
        }}
      />

      <Tabs.Screen
        name="(orders)"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Orders} />
          ),
          tabBarBadge: numberOrders,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Settings} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
