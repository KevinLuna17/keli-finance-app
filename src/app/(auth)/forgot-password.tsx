import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { AuthStepScreen } from "@/components/auth/AuthStepScreen";
import { CodeVerification } from "@/components/auth/CodeVerification";
import {
  getClerkErrorMessage,
  isFieldLevelClerkError,
} from "@/lib/clerk-errors";
import { useSignIn } from "@clerk/expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ForgotPassword() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const isLoading = fetchStatus === "fetching";

  async function sendCode() {
    setFormError("");

    const { error: createError } = await signIn.create({
      identifier: emailAddress,
    });
    if (createError) {
      console.error(JSON.stringify(createError, null, 2));
      if (!isFieldLevelClerkError(createError)) {
        setFormError(getClerkErrorMessage(createError));
      }
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();
    if (sendCodeError) {
      console.error(JSON.stringify(sendCodeError, null, 2));
      if (!isFieldLevelClerkError(sendCodeError)) {
        setFormError(getClerkErrorMessage(sendCodeError));
      }
      return;
    }

    setCodeSent(true);
  }

  async function handleVerifyCode(code: string) {
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) {
      throw error;
    }
  }

  async function submitNewPassword() {
    setFormError("");

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      if (!isFieldLevelClerkError(error)) {
        setFormError(getClerkErrorMessage(error));
      }
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({
        navigate: async ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });

      if (finalizeError) {
        console.error(JSON.stringify(finalizeError, null, 2));
      }
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  }

  const handleStartOver = () => {
    signIn.reset();
    setCodeSent(false);
    setPassword("");
    setEmailAddress("");
    setFormError("");
  };

  const handleBackToSignIn = () => {
    signIn.reset();
    router.back();
  };

  if (signIn.status === "needs_second_factor") {
    return (
      <AuthStepScreen
        title="Two-factor required"
        subtitle="Your account has 2FA enabled. Sign in from the login screen to continue."
        badge="Security"
        onBack={handleBackToSignIn}
      >
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable className="mt-6 h-14 items-center justify-center rounded-2xl bg-foreground active:opacity-90">
              <Text className="text-lg font-extrabold text-background">
                Back to sign in
              </Text>
            </Pressable>
          </Link>
        </Animated.View>
      </AuthStepScreen>
    );
  }

  if (signIn.status === "needs_new_password") {
    return (
      <AuthStepScreen
        title="Set new password"
        subtitle="Choose a strong password for your account."
        badge="Almost done"
        onBack={handleStartOver}
      >
        <View
          className={`mt-6 mb-3 flex-row items-center h-14 rounded-2xl border px-4 ${
            passwordFocused ? "border-2 border-primary" : "border-border"
          }`}
        >
          <View className="w-12 items-center justify-center">
            <FontAwesome6
              name="lock"
              size={18}
              color={passwordFocused ? "#508A67" : "#5f6e66"}
            />
          </View>
          <TextInput
            className="flex-1 text-card-foreground"
            value={password}
            placeholder="Enter new password"
            placeholderTextColor="#5f6e66"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="h-full w-14 items-center justify-center"
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={18}
              color={passwordFocused ? "#508A67" : "#5f6e66"}
            />
          </Pressable>
        </View>

        {errors.fields.password?.message ? (
          <AuthFieldError message={errors.fields.password.message} />
        ) : null}

        {formError && !errors.fields.password?.message ? (
          <AuthFieldError message={formError} />
        ) : null}

        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <Pressable
            className={`mt-3 h-14 items-center justify-center rounded-2xl bg-brand px-4 ${
              !password || isLoading ? "opacity-70" : "active:opacity-90"
            }`}
            onPress={submitNewPassword}
            disabled={!password || isLoading}
          >
            <Text className="text-lg font-extrabold text-white">
              {isLoading ? "Saving..." : "Set new password"}
            </Text>
          </Pressable>

          <Pressable
            className="mt-3 h-14 items-center justify-center active:opacity-90"
            onPress={handleStartOver}
            disabled={isLoading}
          >
            <Text className="text-base font-bold text-muted-foreground">
              Start over
            </Text>
          </Pressable>
        </Animated.View>
      </AuthStepScreen>
    );
  }

  if (codeSent) {
    return (
      <CodeVerification
        title="Verify your code"
        subtitle={`We sent a password reset code to ${emailAddress}.`}
        codeError={errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerifyCode}
        onResendCode={async () => {
          await signIn.resetPasswordEmailCode.sendCode();
        }}
        onStartOver={handleStartOver}
        verifyButtonText="Verify code"
      />
    );
  }

  return (
    <AuthStepScreen
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset code."
      badge="Reset password"
      onBack={handleBackToSignIn}
    >
      <View
        className={`mt-6 mb-3 flex-row items-center h-14 rounded-2xl border px-4 ${
          emailFocused ? "border-2 border-primary" : "border-border"
        }`}
      >
        <View className="w-12 items-center justify-center">
          <FontAwesome6
            name="envelope"
            size={18}
            color={emailFocused ? "#508A67" : "#5f6e66"}
          />
        </View>
        <TextInput
          className="flex-1 text-card-foreground"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          placeholderTextColor="#5f6e66"
          onChangeText={setEmailAddress}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      {errors.fields.identifier?.message ? (
        <AuthFieldError message={errors.fields.identifier.message} />
      ) : null}

      {formError && !errors.fields.identifier?.message ? (
        <AuthFieldError message={formError} />
      ) : null}

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <Pressable
          className={`mt-3 h-14 items-center justify-center rounded-2xl bg-brand px-4 ${
            !emailAddress || isLoading ? "opacity-70" : "active:opacity-90"
          }`}
          onPress={sendCode}
          disabled={!emailAddress || isLoading}
        >
          <Text className="text-lg font-extrabold text-white">
            {isLoading ? "Sending..." : "Send reset code"}
          </Text>
        </Pressable>
      </Animated.View>
    </AuthStepScreen>
  );
}
