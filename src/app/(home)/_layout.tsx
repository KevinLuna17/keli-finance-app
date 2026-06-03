import { TAB_BAR_ACTIVE, TAB_BAR_INACTIVE } from "@/lib/theme-colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TAB_BAR_ACTIVE,
        tabBarInactiveTintColor: TAB_BAR_INACTIVE,
        tabBarStyle: {
          backgroundColor: "hsl(0, 0%, 100%)",
          borderTopColor: "hsl(150, 15%, 85%)",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="session-task"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
