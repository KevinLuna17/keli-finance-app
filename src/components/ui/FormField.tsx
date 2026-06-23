import { FieldErrorMessage } from "@/components/ui/FieldErrorMessage";
import { fieldContainerClass, type FieldVisualState } from "@/lib/input-styles";
import React from "react";
import { View, type ViewProps } from "react-native";

type FormFieldProps = ViewProps & {
  visualState: FieldVisualState;
  error?: string;
  showError?: boolean;
  contentClassName?: string;
  children: React.ReactNode;
};

export function FormField({
  visualState,
  error,
  showError = true,
  contentClassName,
  children,
  className,
  ...viewProps
}: FormFieldProps) {
  return (
    <View className={className} {...viewProps}>
      <View className={`${fieldContainerClass(visualState)} ${contentClassName ?? ""}`}>
        {children}
      </View>
      {showError && error ? <FieldErrorMessage message={error} /> : null}
    </View>
  );
}
