import AuthHeader from "@/components/auth/AuthHeader";
import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { CodeVerification } from "@/components/auth/CodeVerification";
import { SocialLoginSection } from "@/components/auth/SocialLoginSection";
import Bubbles from "@/components/Bubbles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import {
  getClerkErrorMessage,
  isFieldLevelClerkError,
} from "@/lib/clerk-errors";
import { useAuth, useSignUp } from "@clerk/expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const handleSubmit = async () => {
    setFormError("");

    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      if (!isFieldLevelClerkError(error)) {
        setFormError(getClerkErrorMessage(error));
      }
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setFormError(getClerkErrorMessage(sendError));
    }
  };

  const handleVerify = async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      throw error;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
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
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const handleStartOver = () => {
    signUp.reset();
    setFormError("");
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (signUp.status === "complete" || isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <CodeVerification
        title="Verify your account"
        subtitle={`We sent a verification code to ${emailAddress}.`}
        codeError={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching"}
        onVerify={handleVerify}
        onResendCode={async () => {
          await signUp.verifications.sendEmailCode();
        }}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <ScreenLayout edges={["top"]}>
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
          <View
            className={`mb-3 flex-row items-center h-14 rounded-2xl border px-4 ${
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
              placeholder="Email address"
              value={emailAddress}
              onChangeText={setEmailAddress}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholderTextColor="#5f6e66"
            />
          </View>
          {errors.fields.emailAddress?.message ? (
            <AuthFieldError message={errors.fields.emailAddress.message} />
          ) : null}

          <View
            className={`mb-3 flex-row items-center h-14 rounded-2xl border px-4 ${
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
              placeholder="Enter password"
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
