import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors)}>
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="language" options={{ title: "Language" }} />
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
    </Stack>
  );
}
