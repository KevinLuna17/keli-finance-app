import React from "react";
import { Text } from "react-native";

interface FieldErrorMessageProps {
  message: string;
  className?: string;
}

/** Compact error copy under a field — use AuthFieldError for form-level banners. */
export function FieldErrorMessage({
  message,
  className,
}: FieldErrorMessageProps) {
  return (
    <Text
      className={`mt-2 mb-1 text-sm leading-5 text-destructive ${className ?? ""}`}
    >
      {message}
    </Text>
  );
}
