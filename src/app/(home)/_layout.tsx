import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "hsl(144, 16%, 37%)",
        tabBarInactiveTintColor: "hsl(150, 9%, 40%)",
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
    </Tabs>
  );
}
