/** Mirrors backend `CATEGORY_ICON_KEYS` — keep in sync when adding new icons. */
export const CATEGORY_ICON_KEYS = [
  "food",
  "transport",
  "housing",
  "utilities",
  "healthcare",
  "shopping",
  "entertainment",
  "education",
  "travel",
  "subscriptions",
  "salary",
  "freelance",
  "bonus",
  "investment",
  "gift",
  "other",
  "folder",
  "tag",
  "bookmark",
  "star",
] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number];

export const DEFAULT_CATEGORY_ICON_KEY: CategoryIconKey = "folder";

export function isCategoryIconKey(value: string): value is CategoryIconKey {
  return (CATEGORY_ICON_KEYS as readonly string[]).includes(value);
}

export function parseCategoryIconKey(value: string | undefined | null): CategoryIconKey {
  if (value && isCategoryIconKey(value)) {
    return value;
  }

  return DEFAULT_CATEGORY_ICON_KEY;
}
