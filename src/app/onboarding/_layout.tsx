import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function OnboardingLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="first-transaction"
        options={{
          ...getModalStackScreenOptions(colors),
          title: t("transactionForm.addTitle"),
        }}
      />
    </Stack>
  );
}
