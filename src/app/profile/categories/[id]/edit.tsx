import { CategoryFormScreen } from "@/components/categories/category-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function EditCategoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CategoryFormScreen mode="edit" categoryId={id} />;
}
