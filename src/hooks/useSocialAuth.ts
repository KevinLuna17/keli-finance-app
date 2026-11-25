import i18n from "@/i18n";
import { getClerkErrorMessage, isClerkCancellation } from "@/lib/clerk-errors";
import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useState } from "react";
import { Alert } from "react-native";

type OAuthStrategy = "oauth_google" | "oauth_apple";

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
          i18n.t("auth.errors.signInIncompleteTitle"),
          i18n.t("auth.errors.signInIncomplete"),
        );
        return;
      }

      await setActive({ session: createdSessionId });
    } catch (error) {
      if (isClerkCancellation(error)) {
        return;
      }

      console.error("Social auth error:", error);
      Alert.alert(i18n.t("auth.errors.title"), getClerkErrorMessage(error));
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
