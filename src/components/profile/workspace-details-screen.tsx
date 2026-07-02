import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { WorkspaceFormFields } from "@/components/profile/workspace-form-fields";
import { WorkspaceMemberRow } from "@/components/profile/workspace-member-row";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { useWorkspaceForm } from "@/hooks/use-workspace-form";
import { useBackendSync } from "@/hooks/useBackendSync";
import { useLocalSearchParams, useRouter, Href, useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export function WorkspaceDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    workspaces,
    isBootstrapping,
    status,
    error,
    refreshWorkspaces,
  } = useBackendSync();

  const workspace = workspaces.find((item) => item.id === id) ?? null;
  const isLoadingWorkspace =
    isBootstrapping || (status === "syncing" && workspaces.length === 0);

  const {
    owner,
    regularMembers,
    isLoading: isLoadingMembers,
    error: membersError,
    removingMemberId,
    refresh: refreshMembers,
    removeMember,
  } = useWorkspaceMembers({
    workspaceId: workspace?.id,
    enabled: Boolean(workspace && workspace.type === "shared"),
    });

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      void refreshMembers();
    }, [refreshMembers]),
  );

  const { form, onSubmit, onDelete, submitError, isSubmitting, isDeleting, isSubmitDisabled } =
    useWorkspaceForm({
      mode: "edit",
      workspace,
      onSuccess: async () => {
        await refreshWorkspaces();
        router.back();
      },
      onDeleted: async () => {
        await refreshWorkspaces();
        router.back();
      },
    });

  const confirmDelete = () => {
    Alert.alert(
      t("workspaces.deleteConfirmTitle"),
      t("workspaces.deleteConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("workspaces.remove"),
          style: "destructive",
          onPress: () => {
            void onDelete();
          },
        },
      ],
    );
  };

  const confirmRemoveMember = (memberName: string, memberId: string) => {
    Alert.alert(
      t("workspaces.removeMemberTitle"),
      t("workspaces.removeMemberMessage", { name: memberName }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("workspaces.remove"),
          style: "destructive",
          onPress: () => {
            void removeMember(memberId);
          },
        },
      ],
    );
  };

  if (isLoadingWorkspace) {
    return (
      <ScreenLayout
        edges={["bottom"]}
        background="modal"
        className="items-center justify-center"
      >
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (error || !workspace) {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-destructive">
            {error ?? t("workspaces.notFound")}
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => {
              if (error) {
                void refreshWorkspaces();
                return;
              }

              router.back();
            }}
          >
            <Text className="font-semibold text-brand-foreground">
              {error ? t("workspaces.retry") : t("workspaces.goBack")}
            </Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  if (workspace.type === "personal" || workspace.role !== "owner") {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-muted-foreground">
            {t("workspaces.onlyOwnersCanManage")}
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">{t("workspaces.goBack")}</Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout edges={["bottom"]} background="modal" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 pt-4"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {submitError ? (
          <View className="mb-4">
            <AuthFieldError message={submitError} />
          </View>
        ) : null}

        <WorkspaceFormFields
          control={form.control}
          errors={form.formState.errors}
          disabled={isSubmitting || isDeleting}
        />

        <View className="mt-8">
          <Text className="text-lg font-bold text-foreground">{t("workspaces.ownerTitle")}</Text>

          {isLoadingMembers ? (
            <View className="mt-4 items-center py-6">
              <ActivityIndicator size="small" color="hsl(144, 16%, 37%)" />
            </View>
          ) : null}

          {membersError && !owner ? (
            <View className="mt-4">
              <TransactionsErrorState
                message={membersError}
                onRetry={refreshMembers}
              />
            </View>
          ) : null}

          {owner ? (
            <View className="mt-4">
              <WorkspaceMemberRow member={owner} subtitle={t("workspaces.ownerSubtitle")} />
            </View>
          ) : null}
        </View>

        <View className="mt-8">
          <Text className="text-lg font-bold text-foreground">{t("workspaces.membersTitle")}</Text>

          {isLoadingMembers && regularMembers.length === 0 ? (
            <View className="mt-4 items-center py-6">
              <ActivityIndicator size="small" color="hsl(144, 16%, 37%)" />
            </View>
          ) : null}

          {membersError && !isLoadingMembers ? (
            <View className="mt-4">
              <Text className="text-sm text-destructive">{membersError}</Text>
            </View>
          ) : null}

          {!isLoadingMembers && !membersError && regularMembers.length === 0 ? (
            <View className="mt-4 rounded-2xl border border-dashed border-border bg-card px-4 py-6">
              <Text className="text-center text-sm text-muted-foreground">
                {t("workspaces.noMembers")}
              </Text>
            </View>
          ) : null}

          {regularMembers.length > 0 ? (
            <View className="mt-4 gap-3">
              {regularMembers.map((member) => (
                <WorkspaceMemberRow
                  key={member.id}
                  member={member}
                  subtitle={t("workspaces.memberSubtitle")}
                  canRemove
                  isRemoving={removingMemberId === member.id}
                  onRemove={() =>
                    confirmRemoveMember(
                      member.name?.trim() || member.email,
                      member.id,
                    )
                  }
                />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View className="gap-3 bg-card px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting || isDeleting}
          onPress={() =>
            router.push(`/profile/workspaces/${workspace.id}/invite` as Href)
          }
          className="items-center rounded-2xl border border-border py-4 active:opacity-90"
        >
          <Text className="text-base font-semibold text-foreground">
            {t("workspaces.inviteMember")}
          </Text>
        </Pressable>

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
              {t("profileScreen.saveChanges")}
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isDeleting || isSubmitting }}
          disabled={isDeleting || isSubmitting}
          onPress={confirmDelete}
          className="items-center rounded-2xl border border-destructive py-4"
        >
          {isDeleting ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <Text className="text-base font-semibold text-destructive">
              {t("workspaces.deleteWorkspace")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
