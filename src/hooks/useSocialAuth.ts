import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useState } from "react";
import { Alert } from "react-native";

type OAuthStrategy = "oauth_google" | "oauth_apple";

function getClerkErrorMessage(error: unknown): string | null {
  const clerkError = error as {
    errors?: { message?: string }[];
    message?: string;
  };

  return clerkError.errors?.[0]?.message ?? clerkError.message ?? null;
}

function isOAuthCancelled(
  authSessionResult?: { type?: string } | null,
): boolean {
  return (
    authSessionResult?.type === "cancel" ||
    authSessionResult?.type === "dismiss"
  );
}

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(
    null,
  );
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: OAuthStrategy) => {
    if (loadingStrategy) return;

    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive, authSessionResult } =
        await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (isOAuthCancelled(authSessionResult)) {
        return;
      }

      if (!createdSessionId || !setActive) {
        Alert.alert(
          "Sign-in incomplete",
          "Sign-in did not complete. Please try again.",
        );
        return;
      }

      await setActive({ session: createdSessionId });
    } catch (error) {
      const message = getClerkErrorMessage(error);

      if (message?.toLowerCase().includes("cancel")) {
        return;
      }

      console.error("Social auth error:", error);
      Alert.alert(
        "Error",
        message ?? "Failed to sign in. Please try again.",
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
