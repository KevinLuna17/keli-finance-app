import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { Stack, useTheme } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TransactionLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors, t("back"))}>
      <Stack.Screen name="new" options={{ title: t("transactionForm.addTitle") }} />
      <Stack.Screen name="[id]/edit" options={{ title: t("transactionForm.editTitle") }} />
    </Stack>
  );
}
