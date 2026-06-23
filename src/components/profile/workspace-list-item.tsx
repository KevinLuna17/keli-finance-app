import type { Workspace } from "@/services/workspaces/workspace.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type WorkspaceListItemProps = {
  workspace: Workspace;
  onPress?: () => void;
};

function getWorkspaceTypeLabel(type: Workspace["type"]): string {
  return type === "personal" ? "Personal" : "Shared";
}

export function WorkspaceListItem({
  workspace,
  onPress,
}: WorkspaceListItemProps) {
  const isEditable =
    workspace.type === "shared" && workspace.role === "owner" && onPress;

  return (
    <Pressable
      className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-4 active:opacity-90"
      onPress={onPress}
      disabled={!isEditable}
      accessibilityRole={isEditable ? "button" : "text"}
      accessibilityLabel={`${workspace.name}, ${getWorkspaceTypeLabel(workspace.type)}`}
    >
      <View className="size-10 items-center justify-center rounded-full bg-muted">
        <FontAwesome6
          name={workspace.type === "personal" ? "wallet" : "users"}
          size={16}
          color="#508A67"
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-card-foreground">
          {workspace.name}
        </Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          {getWorkspaceTypeLabel(workspace.type)}
          {workspace.type === "shared" && workspace.role === "member"
            ? " · Member"
            : null}
        </Text>
      </View>

      {isEditable ? (
        <FontAwesome6 name="chevron-right" size={14} color="#94A3B8" />
      ) : null}
    </Pressable>
  );
}
