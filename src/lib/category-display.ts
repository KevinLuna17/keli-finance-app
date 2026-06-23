import { resolveCategoryIconStyle } from "@/lib/category-icon-registry";
import type { Category } from "@/services/categories/category.types";
import { parseCategoryIconKey, type CategoryIconKey } from "@/types/category-icon";

export type CategoryDisplaySource = Pick<Category, "id" | "name"> & {
  iconKey?: CategoryIconKey | string;
};

export type CategoryDisplay = CategoryDisplaySource & {
  icon: ReturnType<typeof resolveCategoryIconStyle>["icon"];
  iconBackgroundClassName: string;
  iconColor: string;
};

export function getCategoryDisplay(
  source: CategoryDisplaySource,
): CategoryDisplay {
  const iconKey = parseCategoryIconKey(source.iconKey);
  const style = resolveCategoryIconStyle(iconKey);

  return {
    id: source.id,
    name: source.name,
    iconKey,
    ...style,
  };
}

export type CategoryLookup = Record<string, CategoryDisplaySource>;

export function buildCategoryLookup(
  categories: Category[],
): CategoryLookup {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      {
        id: category.id,
        name: category.name,
        iconKey: parseCategoryIconKey(category.iconKey),
      },
    ]),
  );
}

export function getCategoryDisplayById(
  categoryId: string,
  lookup: CategoryLookup,
): CategoryDisplay {
  const source = lookup[categoryId];

  if (!source) {
    return getCategoryDisplay({
      id: categoryId,
      name: "Unknown",
      iconKey: "folder",
    });
  }

  return getCategoryDisplay(source);
}
