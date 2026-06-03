import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { fieldContainerClass, type FieldVisualState } from "@/lib/input-styles";
import React from "react";
import { View, type ViewProps } from "react-native";

type FormFieldProps = ViewProps & {
  visualState: FieldVisualState;
  error?: string;
  showError?: boolean;
  children: React.ReactNode;
};

export function FormField({
  visualState,
  error,
  showError = true,
  children,
  className,
  ...viewProps
}: FormFieldProps) {
  return (
    <View className={className} {...viewProps}>
      <View className={fieldContainerClass(visualState)}>{children}</View>
      {showError && error ? (
        <AuthFieldError message={error} className="mt-3" />
      ) : null}
    </View>
  );
}
