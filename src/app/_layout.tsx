import BackendSyncError from "@/components/ui/BackendSyncError";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useBackendSync } from "@/hooks/useBackendSync";
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
import { useColorScheme, View } from "react-native";
import "../../global.css";

// Completes pending OAuth browser sessions when the app reopens after redirect.
WebBrowser.maybeCompleteAuthSession();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoaded } = useAuth();
  const { isBootstrapping, status, error, retry } = useBackendSync();

  if (!isLoaded || (isSignedIn && isBootstrapping)) {
    return (
      <View className="flex-1">
        <LoadingScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (isSignedIn && status === "error" && error) {
    return (
      <View className="flex-1">
        <BackendSyncError message={error} onRetry={retry} />
        <StatusBar style="auto" />
      </View>
    );
  }

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
          <Stack.Screen
            name="transaction"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="profile"
            options={{ headerShown: false, presentation: "modal" }}
          />
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
