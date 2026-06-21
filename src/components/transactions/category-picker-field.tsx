import { MockCategory } from "@/mocks/categories";
import { hapticTabPress } from "@/lib/haptics";
import { FieldErrorMessage } from "@/components/ui/FieldErrorMessage";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type CategoryPickerFieldProps = {
  label: string;
  categories: MockCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
  disabled?: boolean;
};

export function CategoryPickerField({
  label,
  categories,
  value,
  onChange,
  error,
  disabled = false,
}: CategoryPickerFieldProps) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {categories.map((category) => {
          const selected = value === category.id;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => {
                hapticTabPress();
                onChange(category.id);
              }}
              className={`rounded-full border px-4 py-2 ${
                selected
                  ? "border-brand bg-brand"
                  : "border-border bg-card"
              } ${error ? "border-destructive" : ""}`}
            >
              <Text
                className={`text-sm font-medium ${
                  selected ? "text-brand-foreground" : "text-foreground"
                }`}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {error ? <FieldErrorMessage message={error} /> : null}
    </View>
  );
}
