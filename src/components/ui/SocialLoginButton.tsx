import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

export type SocialProvider = "google" | "apple";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  isConnecting?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const PROVIDER_LABELS: Record<SocialProvider, string> = {
  google: "Google",
  apple: "Apple",
};

export function SocialLoginButton({
  provider,
  onPress,
  isConnecting = false,
  disabled = false,
  fullWidth = false,
}: SocialLoginButtonProps) {
  const label = PROVIDER_LABELS[provider];
  const isDisabled = disabled || isConnecting;

  return (
    <Pressable
      className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
        fullWidth ? "w-full" : "w-52"
      } ${isDisabled ? "opacity-70" : ""}`}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
        {provider === "google" ? (
          <Image
            source={require("../../../assets/images/google.png")}
            style={{ width: 20, height: 20 }}
          />
        ) : (
          <FontAwesome6 name="apple" size={22} color="#111" />
        )}
      </View>

      <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
        {isConnecting ? "Connecting..." : label}
      </Text>

      <FontAwesome name="angle-right" size={18} color="#5f6e66" />
    </Pressable>
  );
}
