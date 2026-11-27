import { WorkspaceCurrencyList } from "@/components/profile/workspace-currency-list";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { TextField } from "@/components/ui/TextField";
import { useBackendSync } from "@/hooks/useBackendSync";
import { hapticSelection } from "@/lib/haptics";
import { updateProfile } from "@/services/profile/profile.service";
import { useAuth } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

const STEP_COUNT = 3;

type TransactionType = "income" | "expense";

/**
 * First-launch onboarding: welcome, currency confirmation and first
 * transaction. Every step can be skipped. It never creates resources:
 * provisioning already ran during sign in.
 */
export function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getToken } = useAuth();
  const { currentWorkspace, backendUser, completeOnboarding, refreshBackendUser } =
    useBackendSync();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(backendUser?.name ?? "");
  const [isFinishing, setIsFinishing] = useState(false);

  // Saves the name only when it changed and is long enough for the backend
  // (2+ chars). Failures never block onboarding; the user can edit it later.
  const persistName = useCallback(async () => {
    const trimmed = name.trim();

    if (trimmed.length < 2 || trimmed === (backendUser?.name ?? "").trim()) {
      return;
    }

    try {
      await updateProfile(() => getToken(), { name: trimmed });
      await refreshBackendUser();
    } catch (persistError) {
      if (__DEV__) {
        console.warn("[Onboarding] save name failed:", persistError);
      }
    }
  }, [name, backendUser?.name, getToken, refreshBackendUser]);

  const finish = async () => {
    setIsFinishing(true);
    await persistName();
    await completeOnboarding();
  };

  const goNext = () => {
    hapticSelection();
    // The first-transaction path completes onboarding without finish(), so the
    // name is saved when leaving the welcome step, before any later step.
    if (step === 0) {
      void persistName();
    }
    setStep((current) => Math.min(current + 1, STEP_COUNT - 1));
  };

  const openFirstTransaction = (type: TransactionType) => {
    hapticSelection();
    router.push({ pathname: "/onboarding/first-transaction", params: { type } });
  };

  return (
    <ScreenLayout background="custom" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <View className="flex-row items-center justify-between px-6 pt-2">
        <View
          className="flex-row gap-2"
          accessibilityLabel={t("onboarding.progress", {
            current: step + 1,
            total: STEP_COUNT,
          })}
        >
          {Array.from({ length: STEP_COUNT }, (_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === step ? "w-6 bg-brand" : "w-2 bg-muted"
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={() => void finish()}
          disabled={isFinishing}
          accessibilityRole="button"
          hitSlop={12}
        >
          <Text className="text-base font-medium text-muted-foreground">
            {t("onboarding.skip")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6">
        {step === 0 ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow items-center justify-center pb-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("../../../assets/images/keli-icon.png")}
              style={{ width: 150, height: 150 }}
              contentFit="contain"
            />
            <Text className="mt-6 text-center text-3xl font-bold text-foreground">
              {t("onboarding.welcomeTitle")}
            </Text>
            <Text className="mt-3 text-center text-base text-muted-foreground">
              {t("onboarding.welcomeBody")}
            </Text>

            <View className="mt-8 w-full">
              <Text className="mb-2 text-sm font-medium text-foreground">
                {t("onboarding.nameLabel")}
              </Text>
              <TextField
                value={name}
                onChangeText={setName}
                editable={!isFinishing}
                placeholder={t("onboarding.namePlaceholder")}
                autoCapitalize="words"
                maxLength={100}
                returnKeyType="done"
              />
            </View>
          </ScrollView>
        ) : null}

        {step === 1 ? (
          <View className="flex-1 pt-8">
            <Text className="text-3xl font-bold text-foreground">
              {t("onboarding.currencyTitle")}
            </Text>
            <Text className="mb-6 mt-3 text-base text-muted-foreground">
              {t("onboarding.currencyBody")}
            </Text>
            {currentWorkspace ? (
              <ScrollView
                className="flex-1"
                contentContainerClassName="pb-4"
                showsVerticalScrollIndicator={false}
              >
                <WorkspaceCurrencyList workspaceId={currentWorkspace.id} />
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
            )}
          </View>
        ) : null}

        {step === 2 ? (
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-foreground">
              {t("onboarding.firstTransactionTitle")}
            </Text>
            <Text className="mb-8 mt-3 text-base text-muted-foreground">
              {t("onboarding.firstTransactionBody")}
            </Text>

            <View className="gap-3">
              <FirstTransactionOption
                icon="arrow-trend-down"
                label={t("onboarding.addExpense")}
                onPress={() => openFirstTransaction("expense")}
                disabled={isFinishing}
              />
              <FirstTransactionOption
                icon="arrow-trend-up"
                label={t("onboarding.addIncome")}
                onPress={() => openFirstTransaction("income")}
                disabled={isFinishing}
              />
            </View>
          </View>
        ) : null}
      </View>

      <View className="px-6 pb-6 pt-4">
        {step < STEP_COUNT - 1 ? (
          <Pressable
            className="items-center rounded-2xl bg-brand py-4"
            onPress={goNext}
            disabled={isFinishing}
            accessibilityRole="button"
          >
            <Text className="text-base font-semibold text-brand-foreground">
              {t("onboarding.continue")}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            className="items-center rounded-2xl py-4"
            onPress={() => void finish()}
            disabled={isFinishing}
            accessibilityRole="button"
          >
            {isFinishing ? (
              <ActivityIndicator color="hsl(144, 16%, 37%)" />
            ) : (
              <Text className="text-base font-semibold text-muted-foreground">
                {t("onboarding.later")}
              </Text>
            )}
          </Pressable>
        )}
      </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

type FirstTransactionOptionProps = {
  icon: "arrow-trend-down" | "arrow-trend-up";
  label: string;
  onPress: () => void;
  disabled: boolean;
};

function FirstTransactionOption({
  icon,
  label,
  onPress,
  disabled,
}: FirstTransactionOptionProps) {
  return (
    <Pressable
      className="flex-row items-center rounded-2xl bg-card px-4 py-5"
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <View className="size-10 items-center justify-center rounded-full bg-brand/20">
        <FontAwesome6 name={icon} size={16} color="#508A67" />
      </View>
      <Text className="ml-3 flex-1 text-base font-semibold text-card-foreground">
        {label}
      </Text>
      <FontAwesome6 name="chevron-right" size={14} color="#9CA3AF" />
    </Pressable>
  );
}
