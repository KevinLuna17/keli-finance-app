import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [focused, setFocused] = React.useState(false);
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
    <SafeAreaView
      className="flex-1 bg-primary dark:bg-secondary"
      edges={["top", "bottom"]}
    >
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-secondary/20 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-secondary/20 dark:bg-background/35" />

      <View className="flex-1 px-6 pt-4">
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mt-8"
        >
          <Text className="mt-4 text-center text-3xl font-extrabold text-primary-foreground dark:text-foreground">
            {title}
          </Text>

          <Text className="mt-2 text-center text-base leading-6 text-primary-foreground/80 dark:text-foreground/75">
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
          <View
            className={`mt-6 mb-3 flex-row items-center h-14 rounded-2xl border px-4 ${
              focused ? "border-2 border-primary" : "border-border"
            }`}
          >
            <View className="h-full w-12 items-center justify-center">
              <FontAwesome6
                name="shield-halved"
                size={18}
                color={focused ? "#508A67" : "#5f6e66"}
              />
            </View>
            <TextInput
              className="flex-1 text-base text-card-foreground"
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor="#5f6e66"
              onChangeText={setCode}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
          </View>

          {displayError ? (
            <Animated.View
              entering={FadeInDown.duration(300)}
              className="mb-3 flex-row items-center rounded-2xl border border-destructive bg-destructive/10 px-4 py-2"
            >
              <FontAwesome
                name="exclamation-triangle"
                size={16}
                color="#DC2626"
              />
              <Text className="ml-2 flex-1 text-red-500">{displayError}</Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Pressable
              className={`mt-3 h-14 flex-row items-center justify-center rounded-2xl bg-foreground px-4 ${
                isVerifyDisabled ? "opacity-70" : "active:opacity-90"
              }`}
              onPress={handleVerify}
              disabled={isVerifyDisabled}
            >
              <Text className="text-lg font-extrabold text-background">
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
    </SafeAreaView>
  );
}
