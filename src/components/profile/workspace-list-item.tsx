import type { CurrentWorkspace } from "@/services/workspaces/workspace.types";
import {
  ProfileGlassCard,
  ProfileGlassPressable,
} from "@/components/profile/profile-glass-card";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type WorkspaceListItemProps = {
  workspace: CurrentWorkspace;
  isActive: boolean;
  onSelect: () => void;
  onEdit?: () => void;
};

export function WorkspaceListItem({
  workspace,
  isActive,
  onSelect,
  onEdit,
}: WorkspaceListItemProps) {
  const { t } = useTranslation();
  const canEdit =
    workspace.type === "shared" && workspace.role === "owner" && onEdit;

  const typeLabel =
    workspace.type === "personal" ? t("workspaces.personal") : t("workspaces.shared");

  return (
    <View className="flex-row items-center gap-2">
      <ProfileGlassPressable
        className="flex-1"
        contentClassName="flex-row items-center px-4 py-4"
        active={isActive}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`${workspace.name}, ${typeLabel}${
          isActive ? `, ${t("workspaces.currentWorkspace")}` : ""
        }`}
      >
        <View
          className={`size-10 items-center justify-center rounded-full ${
            isActive ? "bg-brand/20" : "bg-muted/80"
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
            {typeLabel}
            {workspace.type === "shared" && workspace.role === "member"
              ? ` · ${t("workspaces.member")}`
              : null}
          </Text>
        </View>

        {isActive ? (
          <FontAwesome6 name="circle-check" size={18} color="#508A67" />
        ) : null}
      </ProfileGlassPressable>

      {canEdit ? (
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t("workspaces.manage", { name: workspace.name })}
        >
          <ProfileGlassCard
            radius={16}
            interactive
            contentClassName="size-11 items-center justify-center"
          >
            <FontAwesome6 name="pen" size={14} color="#64748B" />
          </ProfileGlassCard>
        </Pressable>
      ) : null}
    </View>
  );
}
