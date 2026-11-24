import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors)}>
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="language" options={{ title: "Language" }} />
      <Stack.Screen name="categories/index" />
      <Stack.Screen name="categories/new" />
      <Stack.Screen name="categories/[id]/edit" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen
        name="workspaces/create"
        options={{ title: "Create Workspace" }}
      />
      <Stack.Screen
        name="workspaces/[id]/edit"
        options={{ title: "Workspace Details" }}
      />
      <Stack.Screen
        name="workspaces/[id]/invite"
        options={{ title: "Invite Member" }}
      />
      <Stack.Screen
        name="workspaces/[id]/currency"
        options={{ title: "Workspace Currency" }}
      />
    </Stack>
  );
}
