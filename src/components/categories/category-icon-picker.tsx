import { resolveCategoryIconStyle } from "@/lib/category-icon-registry";
import { hapticSelection } from "@/lib/haptics";
import { CATEGORY_ICON_KEYS, type CategoryIconKey } from "@/types/category-icon";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type CategoryIconPickerProps = {
  label: string;
  value: CategoryIconKey;
  onChange: (iconKey: CategoryIconKey) => void;
  disabled?: boolean;
};

export function CategoryIconPicker({
  label,
  value,
  onChange,
  disabled = false,
}: CategoryIconPickerProps) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      <View className="flex-row flex-wrap gap-3">
        {CATEGORY_ICON_KEYS.map((iconKey) => {
          const selected = iconKey === value;
          const style = resolveCategoryIconStyle(iconKey);

          return (
            <Pressable
              key={iconKey}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              accessibilityLabel={iconKey}
              disabled={disabled}
              onPress={() => {
                hapticSelection();
                onChange(iconKey);
              }}
              className={`size-12 items-center justify-center rounded-2xl border ${
                selected ? "border-brand bg-brand" : "border-border bg-card"
              }`}
            >
              <FontAwesome6
                name={style.icon}
                size={18}
                color={selected ? "#FFFFFF" : style.iconColor}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
