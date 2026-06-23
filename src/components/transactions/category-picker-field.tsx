import { FieldErrorMessage } from "@/components/ui/FieldErrorMessage";
import { getCategoryDisplay } from "@/lib/category-display";
import { hapticTabPress } from "@/lib/haptics";
import type { Category } from "@/services/categories/category.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type CategoryPickerFieldProps = {
  label: string;
  categories: Category[];
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
          const display = getCategoryDisplay(category);

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
              className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                selected
                  ? "border-brand bg-brand"
                  : "border-border bg-card"
              } ${error ? "border-destructive" : ""}`}
            >
              <FontAwesome6
                name={display.icon}
                size={14}
                color={selected ? "#FFFFFF" : display.iconColor}
              />
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
