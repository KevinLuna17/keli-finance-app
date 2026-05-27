import { CodeVerification } from "@/components/auth/CodeVerification";
import useSocialAuth from "@/hooks/useSocialAuth";
import { Image } from "expo-image";
import * as React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Bubbles from "@/components/Bubbles";
import { useSignIn } from "@clerk/expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [secondFactor, setSecondFactor] = React.useState(false);

  const [error, setError] = React.useState("");

  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";

  const isLoading = isAppleClicked || isGoogleClicked;

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
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
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        setSecondFactor(true);
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
      setError(`Sign in incomplete: ${signIn.status}`);
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
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };
  const handleStartOver = () => {
    signIn.reset();
    setSecondFactor(false);
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
    <SafeAreaView
      className="flex-1 bg-background dark:bg-secondary"
      edges={["top"]}
    >
      {/* decorative elements */}
      <Bubbles />

      <View className="flex-row items-center justify-center">
        <View className="flex-col px-4 w-1/2 items-center justify-center">
          <Text className="text-6xl font-bold tracking-[1px] text-brand uppercase font-mono dark:text-foreground">
            Keli
          </Text>

          <Text className="px-6 mt-1 text-[16px] text-secondary-foreground dark:text-foreground/75">
            Plan smarter. Spend happier🌿
          </Text>
        </View>
        <View className="w-1/2 self-center">
          <Image
            source={require("../../../assets/images/keli-icon.png")}
            style={{
              width: "100%",
              height: 300,
              transform: [{ rotate: "10deg" }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
            }}
            contentFit="contain"
          />
        </View>
      </View>

      <View
        className="-mt-8 flex-1 rounded-t-[36px] bg-card px-6 pt-8 shadow-md"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Welcome back
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Login to continue to your account.
        </Text>

        <View className="mt-6">
          {/* Email Input*/}
          <View
            className={`flex-row items-center h-14 border border-border rounded-2xl px-4 mb-3 ${
              emailFocused ? "border-2 border-primary" : "border-border"
            }`}
          >
            <View className="w-12 justify-center items-center">
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
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholderTextColor="#5f6e66"
            />
          </View>
          {errors.fields.identifier && (
            <Text className="text-red-500">
              {errors.fields.identifier.message}
            </Text>
          )}
          {/* Password Input*/}
          <View
            className={`flex-row items-center h-14 border border-border rounded-2xl px-4 mb-3 ${
              passwordFocused ? "border-2 border-primary" : "border-border"
            }`}
          >
            <View className="w-12 justify-center items-center">
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
              onChangeText={(password) => setPassword(password)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="w-14 h-full justify-center items-center"
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={18}
                color={passwordFocused ? "#508A67" : "#5f6e66"}
              />
            </Pressable>
          </View>
          {errors.fields.password && (
            <Text className="text-red-500">
              {errors.fields.password.message}
            </Text>
          )}

          {/* Forgot Password */}
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity className="self-end">
              <Text className="mt-2 mb-2 text-brand font-semibold">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Error Message */}
          {error ? (
            <View className="flex-row items-center rounded-2xl border border-destructive bg-destructive/10 px-4 py-2">
              <FontAwesome
                name="exclamation-triangle"
                size={16}
                color="#DC2626"
              />
              <Text selectable className="ml-2 flex-1 text-red-500">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Sign in Button*/}
          <Pressable
            className={`mt-3 h-14 flex-row items-center rounded-2xl bg-brand px-4 ${
              !emailAddress || !password || fetchStatus === "fetching"
                ? "opacity-70"
                : "active:opacity-90"
            }`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text className="ml-3 flex-1 text-lg text-center font-extrabold text-white">
              {fetchStatus === "fetching" ? "Signing in..." : "Continue"}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#fff" />
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-base leading-6 text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/(auth)/sign-up" asChild>
            <Text className="text-brand font-semibold">Sign up</Text>
          </Link>
        </Text>

        <View className="mt-6">
          <View className="flex-row items-center">
            <View className="h-px flex-1 bg-border" />
            <Text className="px-4 text-sm leading-5 text-muted-foreground">
              Or login with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Social login buttons */}
          <View className="flex-row justify-center items-center gap-4 mt-6">
            {/* Google button */}
            <Pressable
              className={`mb-3 w-52 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
                isLoading ? "opacity-70" : ""
              }`}
              disabled={isLoading}
              onPress={() => handleSocialAuth("oauth_google")}
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                <Image
                  source={require("../../../assets/images/google.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>

              <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                {isGoogleClicked ? "Connecting..." : "Google"}
              </Text>
              <FontAwesome name="angle-right" size={18} color="#5f6e66" />
            </Pressable>

            {/* Apple button */}
            <Pressable
              className={`mb-3 w-52 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
                isLoading ? "opacity-70" : ""
              }`}
              disabled={isLoading}
              onPress={() => handleSocialAuth("oauth_apple")}
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                <FontAwesome6 name="apple" size={22} color="#111" />
              </View>
              <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                {isAppleClicked ? "Connecting..." : "Apple"}
              </Text>
              <FontAwesome name="angle-right" size={18} color="#5f6e66" />
            </Pressable>
          </View>
        </View>

        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
