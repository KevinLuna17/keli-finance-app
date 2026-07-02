import { TextField, TextFieldIconSlot } from "@/components/ui/TextField";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { getInputIconColor } from "@/lib/input-styles";
import { WorkspaceFormValues } from "@/lib/validations/workspace-form.schema";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
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
    <View className="gap-5">
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

      <View>
        <FieldLabel>{t("workspaces.currencyLabel")}</FieldLabel>
        <Controller
          control={control}
          name="currency"
          render={({ field: { value, onChange } }) => (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 pb-1"
            >
              {SUPPORTED_CURRENCIES.map((code) => {
                const isSelected = value === code;
                return (
                  <Pressable
                    key={code}
                    onPress={() => !disabled && onChange(code)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`rounded-xl px-4 py-2.5 ${
                      isSelected
                        ? "bg-brand"
                        : "bg-muted"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? "text-brand-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {code}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        />
        {errors.currency ? (
          <Text className="mt-1 text-xs text-destructive">
            {errors.currency.message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
