import AuthHeader from "@/components/auth/AuthHeader";
import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { CodeVerification } from "@/components/auth/CodeVerification";
import { SocialLoginSection } from "@/components/auth/SocialLoginSection";
import Bubbles from "@/components/Bubbles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useSignUpFlow } from "@/hooks/useSignUpFlow";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function SignUpScreen() {
  const {
    emailAddress,
    password,
    showPassword,
    setShowPassword,
    formError,
    errors,
    fetchStatus,
    isLoaded,
    isSignedIn,
    showEmailVerification,
    setEmailWithErrorClear,
    setPasswordWithErrorClear,
    handleSubmit,
    handleVerify,
    handleStartOver,
    resendEmailCode,
  } = useSignUpFlow();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (showEmailVerification) {
    return (
      <CodeVerification
        title="Verify your account"
        subtitle={`We sent a verification code to ${emailAddress}.`}
        codeError={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching"}
        onVerify={handleVerify}
        onResendCode={resendEmailCode}
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
            Create your account
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Let's get you started with{" "}
          <Text className="font-mono text-sm font-semibold leading-6 text-brand">
            KELI
          </Text>
          .
        </Text>

        <View className="mt-6">
          <AuthTextField
            variant="email"
            value={emailAddress}
            onChangeText={setEmailWithErrorClear}
            error={errors.fields.emailAddress?.message}
          />

          <AuthTextField
            variant="password"
            value={password}
            onChangeText={setPasswordWithErrorClear}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
            error={errors.fields.password?.message}
          />

          {formError &&
          !errors.fields.password?.message &&
          !errors.fields.emailAddress?.message ? (
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
              {fetchStatus === "fetching" ? "Signing up..." : "Sign up"}
            </Text>
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-base leading-6 text-muted-foreground">
          Already have an account?{" "}
          <Link href="/(auth)/sign-in" asChild>
            <Text className="font-semibold text-brand">Sign in</Text>
          </Link>
        </Text>

        <SocialLoginSection dividerLabel="Or sign up with" />

        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By signing up, you agree to our Terms and Privacy Policy.
        </Text>

        <View nativeID="clerk-captcha" />
      </AuthFormCard>
    </ScreenLayout>
  );
}
