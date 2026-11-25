import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors, t("back"))}>
      <Stack.Screen
        name="edit"
        options={{ title: t("profileScreen.editProfile") }}
      />
      <Stack.Screen name="language" options={{ title: t("language") }} />
      <Stack.Screen name="categories/index" />
      <Stack.Screen name="categories/new" />
      <Stack.Screen name="categories/[id]/edit" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen
        name="workspaces/create"
        options={{ title: t("workspaces.createWorkspace") }}
      />
      <Stack.Screen
        name="workspaces/[id]/edit"
        options={{ title: t("workspaces.detailsTitle") }}
      />
      <Stack.Screen
        name="workspaces/[id]/invite"
        options={{ title: t("workspaces.inviteMember") }}
      />
      <Stack.Screen
        name="workspaces/[id]/currency"
        options={{ title: t("workspaces.currencyModalTitle") }}
      />
    </Stack>
  );
}
