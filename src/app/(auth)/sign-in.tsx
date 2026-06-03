import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { CodeVerification } from "@/components/auth/CodeVerification";
import { SocialLoginSection } from "@/components/auth/SocialLoginSection";
import {
  getClerkErrorMessage,
  isFieldLevelClerkError,
} from "@/lib/clerk-errors";
import * as React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AuthHeader from "@/components/auth/AuthHeader";
import Bubbles from "@/components/Bubbles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useSignIn } from "@clerk/expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [secondFactor, setSecondFactor] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const handleSubmit = async () => {
    setFormError("");

    const { error } = await signIn.password({
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

    if (signIn.status === "complete") {
      await signIn.finalize({
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
    } else if (signIn.status === "needs_second_factor") {
      setFormError(
        "Additional verification is required. Try another sign-in method.",
      );
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setFormError(getClerkErrorMessage(sendError));
          return;
        }
        setSecondFactor(true);
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
      setFormError(`Sign in incomplete: ${signIn.status}`);
    }
  };

  const handleVerify = async (code: string) => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      throw error;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
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
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleStartOver = () => {
    signIn.reset();
    setSecondFactor(false);
    setFormError("");
  };

  if (secondFactor) {
    return (
      <CodeVerification
        title="Verify your account"
        subtitle={`We sent a verification code to ${emailAddress}.`}
        codeError={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching"}
        onVerify={handleVerify}
        onResendCode={async () => {
          await signIn.mfa.sendEmailCode();
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
            Welcome back
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Login to continue to your account.
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
          {errors.fields.identifier?.message ? (
            <AuthFieldError message={errors.fields.identifier.message} />
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

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity className="self-end">
              <Text className="mb-2 text-brand font-semibold">
                Forgot password?
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
              {fetchStatus === "fetching" ? "Signing in..." : "Continue"}
            </Text>
            <FontAwesome name="angle-right" size={18} color="#fff" />
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-base leading-6 text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/(auth)/sign-up" asChild>
            <Text className="font-semibold text-brand">Sign up</Text>
          </Link>
        </Text>

        <SocialLoginSection dividerLabel="Or login with" />

        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </AuthFormCard>
    </ScreenLayout>
  );
}
