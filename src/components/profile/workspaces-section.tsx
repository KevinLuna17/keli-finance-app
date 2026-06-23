import { WorkspaceListItem } from "@/components/profile/workspace-list-item";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import type { UseWorkspacesResult } from "@/hooks/use-workspaces";
import { Href, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type WorkspacesSectionProps = Pick<
  UseWorkspacesResult,
  "workspaces" | "isLoading" | "error" | "refresh"
>;

export function WorkspacesSection({
  workspaces,
  isLoading,
  error,
  refresh,
}: WorkspacesSectionProps) {
  const router = useRouter();

  const sortedWorkspaces = [...workspaces].sort((left, right) => {
    if (left.type === right.type) {
      return left.name.localeCompare(right.name);
    }

    return left.type === "personal" ? -1 : 1;
  });

  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-foreground">Workspaces</Text>

      {isLoading && workspaces.length === 0 ? (
        <View className="mt-4 items-center py-8">
          <ActivityIndicator size="small" color="hsl(144, 16%, 37%)" />
        </View>
      ) : null}

      {error && workspaces.length === 0 ? (
        <View className="mt-4">
          <TransactionsErrorState message={error} onRetry={refresh} />
        </View>
      ) : null}

      {workspaces.length > 0 ? (
        <View className="mt-4 gap-3">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceListItem
              key={workspace.id}
              workspace={workspace}
              onPress={
                workspace.type === "shared" && workspace.role === "owner"
                  ? () =>
                      router.push(
                        `/profile/workspaces/${workspace.id}/edit` as Href,
                      )
                  : undefined
              }
            />
          ))}
        </View>
      ) : null}

      {!isLoading && !error ? (
        <Pressable
          className="mt-4 h-14 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card active:opacity-90"
          onPress={() =>
            router.push("/profile/workspaces/create" as Href)
          }
          accessibilityRole="button"
          accessibilityLabel="Create workspace"
        >
          <Text className="text-base font-semibold text-brand">
            + Create Workspace
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
