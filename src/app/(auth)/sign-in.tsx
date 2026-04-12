import useSocialAuth from "@/hooks/useSocialAuth";
import { Image } from "expo-image";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [code, setCode] = React.useState("");

  const [error, setError] = React.useState("");

  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";
  const isGitHubClicked = loadingStrategy === "oauth_github";

  const isLoading = isAppleClicked || isGitHubClicked || isGoogleClicked;

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
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
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
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
      setError(`Sign in incomplete: ${signIn.status}`);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
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
  if (signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Verify your account</Text>
        <TextInput
          className="border border-border rounded-2xl p-4 mb-3"
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text className="text-red-500">{errors.fields.code.message}</Text>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            fetchStatus === "fetching" && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          <Text className="text-lg font-semibold text-card-foreground">
            Verify
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text className="text-lg font-semibold text-card-foreground">
            I need a new code
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.reset()}
        >
          <Text className="text-lg font-semibold text-card-foreground">
            Start over
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-primary dark:bg-secondary"
      edges={["top"]}
    >
      {/* decorative elements */}
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-secondary/20 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-secondary/20 dark:bg-background/35" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
          Keli
        </Text>

        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
          Plan smarter. Spend happier.
        </Text>

        <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
          <Image
            source={require("../../../assets/images/keli-logo.png")}
            style={{ width: "100%", height: 180 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Welcome Back
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Choose a social provider and jump right into your personalized
          financial experience.
        </Text>

        <View className="mt-6">
          {/* Email Input*/}
          <View
            className={`flex-row items-center h-14 border border-border rounded-2xl px-4 mb-3 ${
              emailFocused ? "border-2 border-primary" : "border-border"
            }`}
          >
            <View className="w-12 h-full justify-center items-center">
              <FontAwesome6
                name="envelope"
                size={18}
                color={emailFocused ? "#508A67" : "#5f6e66"}
              />
            </View>
            <TextInput
              className="flex-1 text-base text-card-foreground"
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
            <View className="w-12 h-full justify-center items-center">
              <FontAwesome6
                name="lock"
                size={18}
                color={passwordFocused ? "#508A67" : "#5f6e66"}
              />
            </View>
            <TextInput
              className="flex-1 text-base text-card-foreground"
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
              <Text className="text-base text-muted-foreground font-bold">
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
            className={`mt-3 h-14 flex-row items-center rounded-2xl bg-foreground px-4 ${
              !emailAddress || !password || fetchStatus === "fetching"
                ? "opacity-70"
                : "active:opacity-90"
            }`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text className="ml-3 flex-1 text-lg text-center font-extrabold text-background">
              {fetchStatus === "fetching" ? "Signing in..." : "Continue"}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#fff" />
          </Pressable>
        </View>

        <Text className="mt-3 text-center text-base leading-6 text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/(auth)/sign-up" asChild>
            <Text className="text-muted-foreground text-base font-bold">
              Sign up
            </Text>
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

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0a7ea4",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center", // 🔥 centra vertical
    marginTop: 12,
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
});
