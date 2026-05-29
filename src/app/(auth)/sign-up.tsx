import AuthHeader from "@/components/auth/AuthHeader";
import { CodeVerification } from "@/components/auth/CodeVerification";
import Bubbles from "@/components/Bubbles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import useSocialAuth from "@/hooks/useSocialAuth";
import { useAuth, useSignUp } from "@clerk/expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";

  const isLoading = isAppleClicked || isGoogleClicked;

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      throw error;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
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
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const handleStartOver = () => {
    signUp.reset();
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
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

      <View className="-mt-16 flex-1 rounded-t-[36px] bg-card px-6 pt-8 shadow-md">
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
          {/* Email Input */}
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
          {errors.fields.emailAddress && (
            <Text className="text-red-500">
              {errors.fields.emailAddress.message}
            </Text>
          )}

          {/* Password Input */}
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
          {errors.fields.password && (
            <Text className="text-red-500">
              {errors.fields.password.message}
            </Text>
          )}

          {/* Sign up Button */}
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

        <View className="mt-6">
          <View className="flex-row items-center">
            <View className="h-px flex-1 bg-border" />
            <Text className="px-4 text-sm leading-5 text-muted-foreground">
              Or sign up with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Social login buttons */}
          <View className="flex-row justify-center items-center gap-4 mt-6">
            {/* Google button */}
            <Pressable
              className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
                Platform.OS === "ios" ? "w-52" : "w-full"
              } ${isLoading ? "opacity-70" : ""}`}
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

            {/* Apple button — iOS only */}
            {Platform.OS === "ios" && (
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
            )}
          </View>
        </View>

        {/* Terms and Privacy Policy */}
        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By signing up, you agree to our Terms and Privacy Policy.
        </Text>

        {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
        <View nativeID="clerk-captcha" />
      </View>
    </ScreenLayout>
  );
}
