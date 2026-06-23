import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors)}>
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
