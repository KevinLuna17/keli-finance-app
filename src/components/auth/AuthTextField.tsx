import {
  TextField,
  TextFieldActionSlot,
  TextFieldIconSlot,
  type TextFieldProps,
} from "@/components/ui/TextField";
import { getInputIconColor } from "@/lib/input-styles";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

type AuthTextFieldVariant = "email" | "password" | "code";

type AuthTextFieldProps = Omit<
  TextFieldProps,
  "renderLeftSlot" | "renderRightSlot" | "secureTextEntry"
> & {
  variant: AuthTextFieldVariant;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

const VARIANT_DEFAULTS: Record<
  AuthTextFieldVariant,
  Pick<
    TextFieldProps,
    | "placeholder"
    | "autoCapitalize"
    | "keyboardType"
    | "autoComplete"
    | "textContentType"
    | "secureTextEntry"
  >
> = {
  email: {
    placeholder: "Email address",
    autoCapitalize: "none",
    keyboardType: "email-address",
    autoComplete: "email",
  },
  password: {
    placeholder: "Enter password",
    autoComplete: "password",
    secureTextEntry: true,
  },
  code: {
    placeholder: "Enter your verification code",
    keyboardType: "number-pad",
    autoComplete: "one-time-code",
    textContentType: "oneTimeCode",
  },
};

const VARIANT_ICONS: Record<
  AuthTextFieldVariant,
  React.ComponentProps<typeof FontAwesome6>["name"]
> = {
  email: "envelope",
  password: "lock",
  code: "shield-halved",
};

export function AuthTextField({
  variant,
  showPassword,
  onTogglePassword,
  placeholder,
  ...textFieldProps
}: AuthTextFieldProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const isPassword = variant === "password";
  const resolvedSecureTextEntry = isPassword
    ? !showPassword
    : defaults.secureTextEntry;

  return (
    <TextField
      placeholder={placeholder ?? defaults.placeholder}
      autoCapitalize={defaults.autoCapitalize}
      keyboardType={defaults.keyboardType ?? textFieldProps.keyboardType}
      autoComplete={defaults.autoComplete ?? textFieldProps.autoComplete}
      textContentType={defaults.textContentType ?? textFieldProps.textContentType}
      secureTextEntry={resolvedSecureTextEntry}
      renderLeftSlot={(state) => (
        <TextFieldIconSlot
          className={variant === "code" ? "h-full w-12 items-center justify-center" : undefined}
        >
          <FontAwesome6
            name={VARIANT_ICONS[variant]}
            size={18}
            color={getInputIconColor(state)}
          />
        </TextFieldIconSlot>
      )}
      renderRightSlot={
        isPassword && onTogglePassword
          ? (state) => (
              <TextFieldActionSlot>
                <Pressable
                  onPress={onTogglePassword}
                  className="h-full w-full items-center justify-center"
                >
                  <FontAwesome
                    name={showPassword ? "eye-slash" : "eye"}
                    size={18}
                    color={getInputIconColor(state)}
                  />
                </Pressable>
              </TextFieldActionSlot>
            )
          : undefined
      }
      {...textFieldProps}
    />
  );
}
