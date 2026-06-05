import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "hsl(144, 16%, 37%)",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          marginBottom: 20,
          height: 70,
          width: "80%",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 20,
          borderRadius: 100,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="history" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stadistics"
        options={{
          title: "Stadistics",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="area-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
