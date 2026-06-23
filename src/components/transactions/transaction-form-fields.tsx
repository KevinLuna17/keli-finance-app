import { CategoryPickerField } from "@/components/transactions/category-picker-field";
import { DatePickerField } from "@/components/transactions/date-picker-field";
import { TransactionTypeSegment } from "@/components/transactions/transaction-type-segment";
import { TextField, TextFieldIconSlot } from "@/components/ui/TextField";
import { getInputIconColor } from "@/lib/input-styles";
import { TransactionFormValues } from "@/lib/validations/transaction-form.schema";
import type { Category } from "@/services/categories/category.types";
import { parseCategoryIconKey } from "@/types/category-icon";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Text, View } from "react-native";

type TransactionFormFieldsProps = {
  control: Control<TransactionFormValues>;
  setValue: UseFormSetValue<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  categories: Category[];
  disabled?: boolean;
};

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-sm font-medium text-foreground">{children}</Text>
  );
}

export function TransactionFormFields({
  control,
  setValue,
  errors,
  categories,
  disabled = false,
}: TransactionFormFieldsProps) {
  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) => category.type === selectedType).map(
        (category) => ({
          ...category,
          iconKey: parseCategoryIconKey(category.iconKey),
        }),
      ),
    [categories, selectedType],
  );

  useEffect(() => {
    if (
      selectedCategoryId &&
      !filteredCategories.some((category) => category.id === selectedCategoryId)
    ) {
      setValue("categoryId", "", { shouldValidate: true });
    }
  }, [filteredCategories, selectedCategoryId, setValue]);

  return (
    <View>
      <FieldLabel>Type</FieldLabel>
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <View className="mb-3">
            <TransactionTypeSegment
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          </View>
        )}
      />

      <FieldLabel>Amount</FieldLabel>
      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={!disabled}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount?.message}
            renderLeftSlot={(state) => (
              <TextFieldIconSlot>
                <FontAwesome6
                  name="dollar-sign"
                  size={16}
                  color={getInputIconColor(state)}
                />
              </TextFieldIconSlot>
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field: { value, onChange } }) => (
          <CategoryPickerField
            key={selectedType}
            label="Category"
            categories={filteredCategories}
            value={value}
            onChange={onChange}
            error={errors.categoryId?.message}
            disabled={disabled}
          />
        )}
      />

      <FieldLabel>Description</FieldLabel>
      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={!disabled}
            placeholder="What was this for?"
            error={errors.description?.message}
            renderLeftSlot={(state) => (
              <TextFieldIconSlot>
                <FontAwesome6
                  name="align-left"
                  size={16}
                  color={getInputIconColor(state)}
                />
              </TextFieldIconSlot>
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <DatePickerField
            label="Date"
            value={value}
            onChange={onChange}
            error={errors.date?.message}
            disabled={disabled}
          />
        )}
      />
    </View>
  );
}
