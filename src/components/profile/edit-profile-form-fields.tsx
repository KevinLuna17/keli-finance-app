import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { TextField, TextFieldIconSlot } from "@/components/ui/TextField";
import { getInputIconColor } from "@/lib/input-styles";
import { ProfileFormValues } from "@/lib/validations/profile-form.schema";
import type { Profile } from "@/services/profile/profile.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, View } from "react-native";

type EditProfileFormFieldsProps = {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  profile: Profile;
  disabled?: boolean;
};

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-medium text-foreground">{children}</Text>
  );
}

export function EditProfileFormFields({
  control,
  errors,
  profile,
  disabled = false,
}: EditProfileFormFieldsProps) {
  return (
    <View>
      <FieldLabel>Name</FieldLabel>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={!disabled}
            placeholder="Your name"
            autoCapitalize="words"
            error={errors.name?.message}
            renderLeftSlot={(state) => (
              <TextFieldIconSlot>
                <FontAwesome6
                  name="user"
                  size={16}
                  color={getInputIconColor(state)}
                />
              </TextFieldIconSlot>
            )}
          />
        )}
      />

      <FieldLabel>Email</FieldLabel>
      <TextField
        value={profile.email}
        editable={false}
        selectTextOnFocus={false}
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
      <Text className="-mt-1 mb-3 text-xs text-muted-foreground">
        Email is managed by your sign-in provider and cannot be changed here.
      </Text>
    </View>
  );
}
