import { FormField } from "@/components/ui/FormField";
import { FieldErrorMessage } from "@/components/ui/FieldErrorMessage";
import { hapticTabPress } from "@/lib/haptics";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type DatePickerFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  disabled?: boolean;
};

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function DatePickerField({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: DatePickerFieldProps) {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = React.useState(false);
  const visualState = { focused: showPicker, hasError: Boolean(error) };

  function handleChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    onChange(selectedDate);
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => {
          hapticTabPress();
          setShowPicker(true);
        }}
      >
        <FormField visualState={visualState} showError={false}>
          <Text className="flex-1 text-base text-card-foreground">
            {formatDisplayDate(value)}
          </Text>
        </FormField>
      </Pressable>
      {error ? <FieldErrorMessage message={error} /> : null}
      {showPicker ? (
        <View className="mt-3 overflow-hidden rounded-2xl bg-muted/40">
          <DateTimePicker
            value={value}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
          />
        </View>
      ) : null}
      {Platform.OS === "ios" && showPicker ? (
        <Pressable
          className="mt-2 self-end rounded-xl bg-brand px-4 py-2"
          onPress={() => setShowPicker(false)}
        >
          <Text className="text-sm font-semibold text-brand-foreground">{t("transactionForm.done")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
