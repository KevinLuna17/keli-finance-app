import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { TextField, TextFieldIconSlot } from "@/components/ui/TextField";
import { useInviteMemberForm } from "@/hooks/use-invite-member-form";
import { getInputIconColor } from "@/lib/input-styles";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

type InviteMemberScreenProps = {
  workspaceId: string;
  workspaceName: string;
};

export function InviteMemberScreen({
  workspaceId,
  workspaceName,
}: InviteMemberScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const { form, onSubmit, submitError, isSubmitting, isSubmitDisabled } =
    useInviteMemberForm({
      workspaceId,
      onSuccess: () => router.back(),
    });

  return (
    <ScreenLayout edges={["bottom"]} background="modal" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 pt-4"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-base text-muted-foreground">
          {t("invitations.inviteIntro")}{" "}
          <Text className="font-semibold text-foreground">{workspaceName}</Text>
          {t("invitations.inviteNote")}
        </Text>

        {submitError ? (
          <View className="mb-4 mt-4">
            <AuthFieldError message={submitError} />
          </View>
        ) : null}

        <View className={submitError ? "mt-2" : "mt-4"}>
          <Text className="mb-2 text-sm font-medium text-foreground">
            {t("invitations.emailLabel")}
          </Text>
          <Controller
            control={form.control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
                placeholder={t("invitations.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={form.formState.errors.email?.message}
                renderLeftSlot={(state) => (
                  <TextFieldIconSlot>
                    <FontAwesome6
                      name="envelope"
                      size={16}
                      color={getInputIconColor(state)}
                    />
                  </TextFieldIconSlot>
                )}
              />
            )}
          />
          <Text className="-mt-1 text-xs text-muted-foreground">
            {t("invitations.emailHint")}
          </Text>
        </View>
      </ScrollView>

      <View className="bg-card px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitDisabled }}
          disabled={isSubmitDisabled}
          onPress={onSubmit}
          className={`items-center rounded-2xl py-4 ${
            isSubmitDisabled ? "bg-muted" : "bg-brand"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-base font-semibold ${
                isSubmitDisabled
                  ? "text-muted-foreground"
                  : "text-brand-foreground"
              }`}
            >
              {t("invitations.sendInvitation")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
