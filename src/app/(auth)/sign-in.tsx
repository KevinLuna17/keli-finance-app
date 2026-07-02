import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { CodeVerification } from "@/components/auth/CodeVerification";
import { SocialLoginSection } from "@/components/auth/SocialLoginSection";
import AuthHeader from "@/components/auth/AuthHeader";
import Bubbles from "@/components/Bubbles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useSignInFlow } from "@/hooks/useSignInFlow";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function SignInScreen() {
  const { t } = useTranslation();
  const {
    emailAddress,
    password,
    showPassword,
    setShowPassword,
    secondFactor,
    formError,
    errors,
    fetchStatus,
    setEmailWithErrorClear,
    setPasswordWithErrorClear,
    handleSubmit,
    handleVerify,
    handleStartOver,
    resendMfaCode,
  } = useSignInFlow();

  if (secondFactor) {
    return (
      <CodeVerification
        title={t("auth.verifyAccount")}
        subtitle={t("auth.verificationCodeSentTo", { email: emailAddress })}
        codeError={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching"}
        onVerify={handleVerify}
        onResendCode={resendMfaCode}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <ScreenLayout edges={["top"]} background="custom">
      <Bubbles />
      <AuthHeader />

      <AuthFormCard>
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            {t("auth.welcomeBack")}
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          {t("auth.loginToContinue")}
        </Text>

        <View className="mt-6">
          <AuthTextField
            variant="email"
            value={emailAddress}
            onChangeText={setEmailWithErrorClear}
            error={errors.fields.identifier?.message}
          />

          <AuthTextField
            variant="password"
            value={password}
            onChangeText={setPasswordWithErrorClear}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
            error={errors.fields.password?.message}
          />

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity className="self-end">
              <Text className="mb-2 text-brand font-semibold">
                {t("auth.forgotPassword")}
              </Text>
            </TouchableOpacity>
          </Link>

          {formError &&
          !errors.fields.password?.message &&
          !errors.fields.identifier?.message ? (
            <AuthFieldError message={formError} />
          ) : null}

          <Pressable
            className={`mt-3 h-14 flex-row items-center rounded-2xl bg-brand px-4 ${
              !emailAddress || !password || fetchStatus === "fetching"
                ? "opacity-70"
                : "active:opacity-90"
            }`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text className="ml-3 flex-1 text-center text-lg font-extrabold text-white">
              {fetchStatus === "fetching" ? t("auth.signingIn") : t("auth.continue")}
            </Text>
            <FontAwesome name="angle-right" size={18} color="#fff" />
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-base leading-6 text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link href="/(auth)/sign-up" asChild>
            <Text className="font-semibold text-brand">{t("auth.signUp")}</Text>
          </Link>
        </Text>

        <SocialLoginSection dividerLabel={t("auth.orLoginWith")} />

        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          {t("auth.termsSignIn")}
        </Text>
      </AuthFormCard>
    </ScreenLayout>
  );
}
