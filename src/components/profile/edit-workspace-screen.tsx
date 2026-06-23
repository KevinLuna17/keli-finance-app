import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { WorkspaceFormFields } from "@/components/profile/workspace-form-fields";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useWorkspaceForm } from "@/hooks/use-workspace-form";
import { useBackendSync } from "@/hooks/useBackendSync";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export function EditWorkspaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    workspaces,
    isBootstrapping,
    status,
    error,
    refreshWorkspaces,
  } = useBackendSync();

  const workspace = workspaces.find((item) => item.id === id) ?? null;
  const isLoading = isBootstrapping || (status === "syncing" && workspaces.length === 0);

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
      "Delete workspace",
      "This will permanently remove the shared workspace and its data for all members.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void onDelete();
          },
        },
      ],
    );
  };

  if (isLoading) {
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
            {error ?? "Workspace not found"}
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
              {error ? "Retry" : "Go back"}
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
            Only shared workspace owners can edit this workspace.
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">Go back</Text>
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
            Invite Member
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
              Save Changes
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
              Delete Workspace
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
