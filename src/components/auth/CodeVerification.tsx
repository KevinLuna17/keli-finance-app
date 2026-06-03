import { AuthTextField } from "@/components/auth/AuthTextField";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Bubbles from "../Bubbles";
import { GlassBackButton } from "../glass";
import ScreenLayout from "../ui/ScreenLayout";

interface CodeVerificationProps {
  title: string;
  subtitle?: string;
  codeError?: string;
  isLoading?: boolean;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void> | void;
  onStartOver: () => void;
  verifyButtonText?: string;
  resendButtonText?: string;
  startOverButtonText?: string;
}

export function CodeVerification({
  title,
  subtitle = "Enter the verification code we sent to your email.",
  codeError,
  isLoading = false,
  onVerify,
  onResendCode,
  onStartOver,
  verifyButtonText = "Verify",
  resendButtonText = "I need a new code",
  startOverButtonText = "Start over",
}: CodeVerificationProps) {
  const [code, setCode] = React.useState("");
  const [localError, setLocalError] = React.useState("");

  const displayError = codeError || localError;
  const isVerifyDisabled = isLoading || code.length === 0;

  const handleVerify = async () => {
    setLocalError("");

    try {
      await onVerify(code);
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: { message?: string }[];
        message?: string;
      };
      setLocalError(
        clerkError.errors?.[0]?.message ||
          clerkError.message ||
          "Verification failed",
      );
    }
  };

  const handleStartOver = () => {
    setCode("");
    setLocalError("");
    onStartOver();
  };

  return (
    <ScreenLayout edges={["top", "bottom"]}>
      <Bubbles />

      <View className="z-10 self-start pl-4 pt-4">
        <GlassBackButton onPress={handleStartOver} />
      </View>

      <View className="flex-1 px-6 pt-4">
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mt-8"
        >
          <Text className="mt-4 text-center text-3xl font-extrabold text-brand dark:text-foreground">
            {title}
          </Text>

          <Text className="mt-2 text-center text-base leading-6 text-secondary-foreground dark:text-foreground/75">
            {subtitle}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="mt-8 rounded-[20px] bg-card p-8"
        >
          <View className="self-center rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
              Security check
            </Text>
          </View>

          <AuthTextField
            variant="code"
            containerClassName="mt-6 mb-3"
            value={code}
            onChangeText={setCode}
            error={displayError}
          />

          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Pressable
              className={`mt-3 h-14 flex-row items-center justify-center rounded-2xl bg-brand px-4 ${
                isVerifyDisabled ? "opacity-70" : "active:opacity-90"
              }`}
              onPress={handleVerify}
              disabled={isVerifyDisabled}
            >
              <Text className="text-lg font-extrabold text-white">
                {isLoading ? "Verifying..." : verifyButtonText}
              </Text>
            </Pressable>

            <Pressable
              className="mt-3 h-14 items-center justify-center rounded-2xl border border-border bg-card active:opacity-90"
              onPress={onResendCode}
              disabled={isLoading}
            >
              <Text className="text-base font-semibold text-card-foreground">
                {resendButtonText}
              </Text>
            </Pressable>

            <Pressable
              className="mt-3 h-14 items-center justify-center active:opacity-90"
              onPress={handleStartOver}
              disabled={isLoading}
            >
              <Text className="text-base font-bold text-muted-foreground">
                {startOverButtonText}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}
