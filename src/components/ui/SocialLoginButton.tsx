import { useTheme } from "expo-router";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export type SocialProvider = "google" | "apple";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  isConnecting?: boolean;
  disabled?: boolean;
  /** Full-width layout (e.g. Google-only on Android). */
  fullWidth?: boolean;
}

const PROVIDER_LABELS: Record<SocialProvider, string> = {
  google: "Google",
  apple: "Apple",
};

function ProviderIcon({ provider }: { provider: SocialProvider }) {
  // The Apple mark is monochrome: it must follow the surface (black on light,
  // white on dark), per Apple's Sign in with Apple guidelines. Google keeps
  // its full-color logo.
  const { colors } = useTheme();

  return (
    <View className="h-9 w-9 items-center justify-center">
      {provider === "google" ? (
        <Image
          source={require("../../../assets/images/google.png")}
          style={{ width: 20, height: 20 }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <FontAwesome6 name="apple" size={22} color={colors.text} />
      )}
    </View>
  );
}

function TrailingChevron() {
  return (
    <FontAwesome
      name="angle-right"
      size={18}
      color="#5f6e66"
      importantForAccessibility="no"
    />
  );
}

export function SocialLoginButton({
  provider,
  onPress,
  isConnecting = false,
  disabled = false,
  fullWidth = false,
}: SocialLoginButtonProps) {
  const { t } = useTranslation();
  const providerLabel = PROVIDER_LABELS[provider];
  const connectingLabel = t("auth.connecting");
  const labelText = isConnecting ? connectingLabel : providerLabel;
  const isDisabled = disabled || isConnecting;
  const accessibilityLabel = isConnecting
    ? connectingLabel
    : t("auth.continueWith", { provider: providerLabel });

  const pressableClassName = [
    "h-14 rounded-2xl border border-border bg-card active:opacity-90",
    fullWidth
      ? "relative mb-3 w-full px-4"
      : "mb-3 w-52 flex-row items-center px-4",
    isDisabled ? "opacity-70" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (fullWidth) {
    return (
      <Pressable
        className={pressableClassName}
        disabled={isDisabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, busy: isConnecting }}
      >
        <View className="flex-1 flex-row items-center justify-center gap-3">
          <ProviderIcon provider={provider} />
          <Text className="text-lg font-semibold text-card-foreground">
            {labelText}
          </Text>
        </View>

        <View className="absolute bottom-0 right-4 top-0 justify-center">
          <TrailingChevron />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      className={pressableClassName}
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: isConnecting }}
    >
      <ProviderIcon provider={provider} />

      <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
        {labelText}
      </Text>

      <TrailingChevron />
    </Pressable>
  );
}
