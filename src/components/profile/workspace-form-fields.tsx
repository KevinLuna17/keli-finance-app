import { TextField, TextFieldIconSlot } from "@/components/ui/TextField";
import { getInputIconColor } from "@/lib/input-styles";
import { WorkspaceFormValues } from "@/lib/validations/workspace-form.schema";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type WorkspaceFormFieldsProps = {
  control: Control<WorkspaceFormValues>;
  errors: FieldErrors<WorkspaceFormValues>;
  disabled?: boolean;
};

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-medium text-foreground">{children}</Text>
  );
}

export function WorkspaceFormFields({
  control,
  errors,
  disabled = false,
}: WorkspaceFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <View>
      <FieldLabel>{t("workspaces.nameLabel")}</FieldLabel>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={!disabled}
            placeholder={t("workspaces.namePlaceholder")}
            autoCapitalize="words"
            error={errors.name?.message}
            renderLeftSlot={(state) => (
              <TextFieldIconSlot>
                <FontAwesome6
                  name="users"
                  size={16}
                  color={getInputIconColor(state)}
                />
              </TextFieldIconSlot>
            )}
          />
        )}
      />
      <Text className="-mt-1 text-xs text-muted-foreground">
        {t("workspaces.sharedWorkspaceInfo")}
      </Text>
    </View>
  );
}
