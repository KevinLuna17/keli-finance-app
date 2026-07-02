import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type BackendSyncErrorProps = {
  message: string;
  onRetry: () => void;
};

export default function BackendSyncError({
  message,
  onRetry,
}: BackendSyncErrorProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-secondary">
      <Text className="text-center text-lg font-bold text-foreground">
        {t("sync.errorTitle")}
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-muted-foreground">
        {message}
      </Text>
      <Pressable
        className="mt-8 h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-brand active:opacity-90"
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t("sync.retryLabel")}
      >
        <Text className="text-base font-bold text-primary-foreground">
          {t("sync.retry")}
        </Text>
      </Pressable>
    </View>
  );
}
