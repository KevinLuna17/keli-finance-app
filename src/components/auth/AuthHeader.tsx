import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export default function AuthHeader() {
  return (
    <View className="flex-row items-center justify-center">
      <View className="flex-col px-4 w-1/2 items-center justify-center">
        <Text className="text-6xl font-bold tracking-[1px] text-brand uppercase font-mono dark:text-foreground">
          Keli
        </Text>

        <Text className="px-6 mt-1 text-[16px] text-secondary-foreground dark:text-foreground/75">
          Plan smarter. Spend happier🌿
        </Text>
      </View>
      <View className="w-1/2 self-center">
        <Image
          source={require("../../../assets/images/keli-icon.png")}
          style={{
            width: "100%",
            height: 250,
            transform: [{ rotate: "10deg" }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
          }}
          contentFit="contain"
        />
      </View>
    </View>
  );
}
