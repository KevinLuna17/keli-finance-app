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
import { useTranslation } from "react-i18next";

type AuthTextFieldVariant = "email" | "password" | "code";

type AuthTextFieldProps = Omit<
  TextFieldProps,
  "renderLeftSlot" | "renderRightSlot" | "secureTextEntry"
> & {
  variant: AuthTextFieldVariant;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

const VARIANT_SETTINGS: Record<
  AuthTextFieldVariant,
  Pick<
    TextFieldProps,
    | "autoCapitalize"
    | "keyboardType"
    | "autoComplete"
    | "textContentType"
    | "secureTextEntry"
  >
> = {
  email: {
    autoCapitalize: "none",
    keyboardType: "email-address",
    autoComplete: "email",
  },
  password: {
    autoComplete: "password",
    secureTextEntry: true,
  },
  code: {
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
  const { t } = useTranslation();

  const VARIANT_PLACEHOLDERS: Record<AuthTextFieldVariant, string> = {
    email: t("auth.emailPlaceholder"),
    password: t("auth.passwordPlaceholder"),
    code: t("auth.codePlaceholder"),
  };

  const settings = VARIANT_SETTINGS[variant];
  const isPassword = variant === "password";
  const resolvedSecureTextEntry = isPassword
    ? !showPassword
    : settings.secureTextEntry;

  return (
    <TextField
      placeholder={placeholder ?? VARIANT_PLACEHOLDERS[variant]}
      autoCapitalize={settings.autoCapitalize}
      keyboardType={settings.keyboardType ?? textFieldProps.keyboardType}
      autoComplete={settings.autoComplete ?? textFieldProps.autoComplete}
      textContentType={settings.textContentType ?? textFieldProps.textContentType}
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
