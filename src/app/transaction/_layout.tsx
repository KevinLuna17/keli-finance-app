import { getModalStackScreenOptions } from "@/lib/modal-screen-options";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function TransactionLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={getModalStackScreenOptions(colors)}>
      <Stack.Screen name="new" options={{ title: "Add Transaction" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit Transaction" }} />
    </Stack>
  );
}
