import { FormField } from "@/components/ui/FormField";
import {
  INPUT_PLACEHOLDER_COLOR,
  type FieldVisualState,
} from "@/lib/input-styles";
import React from "react";
import {
  TextInput,
  type TextInputProps,
  View,
  type ViewProps,
} from "react-native";

export type TextFieldProps = Omit<TextInputProps, "placeholderTextColor"> & {
  error?: string;
  containerClassName?: string;
  contentClassName?: string;
  showError?: boolean;
  renderLeftSlot?: (state: FieldVisualState) => React.ReactNode;
  renderRightSlot?: (state: FieldVisualState) => React.ReactNode;
};

export function TextField({
  error,
  containerClassName = "mb-3",
  contentClassName,
  showError = true,
  renderLeftSlot,
  renderRightSlot,
  onFocus,
  onBlur,
  className,
  ...textInputProps
}: TextFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const visualState: FieldVisualState = {
    focused,
    hasError: Boolean(error),
  };

  return (
    <FormField
      visualState={visualState}
      error={error}
      showError={showError}
      contentClassName={contentClassName}
      className={containerClassName}
    >
      {renderLeftSlot?.(visualState)}
      <TextInput
        className={className ?? "flex-1 text-card-foreground"}
        placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...textInputProps}
      />
      {renderRightSlot?.(visualState)}
    </FormField>
  );
}

/** Icon column used by auth and other fields with leading icons. */
export function TextFieldIconSlot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={className ?? "w-12 items-center justify-center"}
    >
      {children}
    </View>
  );
}

/** Trailing action column (e.g. password visibility toggle). */
export function TextFieldActionSlot({
  children,
  ...props
}: ViewProps & { children: React.ReactNode }) {
  return (
    <View
      className="h-full w-14 items-center justify-center"
      {...props}
    >
      {children}
    </View>
  );
}
