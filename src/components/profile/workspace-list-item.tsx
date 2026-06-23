import type { CurrentWorkspace } from "@/services/workspaces/workspace.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type WorkspaceListItemProps = {
  workspace: CurrentWorkspace;
  isActive: boolean;
  onSelect: () => void;
  onEdit?: () => void;
};

function getWorkspaceTypeLabel(type: CurrentWorkspace["type"]): string {
  return type === "personal" ? "Personal" : "Shared";
}

export function WorkspaceListItem({
  workspace,
  isActive,
  onSelect,
  onEdit,
}: WorkspaceListItemProps) {
  const canEdit =
    workspace.type === "shared" && workspace.role === "owner" && onEdit;

  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        className={`flex-1 flex-row items-center rounded-2xl border px-4 py-4 active:opacity-90 ${
          isActive
            ? "border-brand bg-brand/10"
            : "border-border bg-card"
        }`}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`${workspace.name}, ${getWorkspaceTypeLabel(workspace.type)}${
          isActive ? ", current workspace" : ""
        }`}
      >
        <View
          className={`size-10 items-center justify-center rounded-full ${
            isActive ? "bg-brand/20" : "bg-muted"
          }`}
        >
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

        {isActive ? (
          <FontAwesome6 name="circle-check" size={18} color="#508A67" />
        ) : null}
      </Pressable>

      {canEdit ? (
        <Pressable
          className="size-11 items-center justify-center rounded-2xl border border-border bg-card active:opacity-80"
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${workspace.name}`}
        >
          <FontAwesome6 name="pen" size={14} color="#64748B" />
        </Pressable>
      ) : null}
    </View>
  );
}
