import useSocialAuth from "@/hooks/useSocialAuth";
import React from "react";
import { Platform, Text, View } from "react-native";
import { SocialLoginButton } from "./SocialLoginButton";

interface SocialLoginSectionProps {
  dividerLabel: string;
}

export function SocialLoginSection({ dividerLabel }: SocialLoginSectionProps) {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isLoading = loadingStrategy !== null;
  const showApple = Platform.OS === "ios";

  return (
    <View className="mt-6">
      <View className="flex-row items-center">
        <View className="h-px flex-1 bg-border" />
        <Text className="px-4 text-sm leading-5 text-muted-foreground">
          {dividerLabel}
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-4">
        <SocialLoginButton
          provider="google"
          fullWidth={!showApple}
          isConnecting={loadingStrategy === "oauth_google"}
          disabled={isLoading}
          onPress={() => handleSocialAuth("oauth_google")}
        />

        {showApple ? (
          <SocialLoginButton
            provider="apple"
            isConnecting={loadingStrategy === "oauth_apple"}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_apple")}
          />
        ) : null}
      </View>
    </View>
  );
}
