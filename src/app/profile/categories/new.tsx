import { CategoryFormScreen } from "@/components/categories/category-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function NewCategoryRoute() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  return (
    <CategoryFormScreen
      mode="create"
      initialType={type === "income" ? "income" : "expense"}
    />
  );
}
