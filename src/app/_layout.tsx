import AppProviders from "@/providers";
import { useAuth } from "@clerk/expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "react-native";
import "../../global.css";

// Completes pending OAuth browser sessions when the app reopens after redirect.
WebBrowser.maybeCompleteAuthSession();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens - only accesible when NOT signed in*/}
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* App screens - only accesible when signed in*/}
        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name="(home)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
