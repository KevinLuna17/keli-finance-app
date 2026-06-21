import { FontAwesome6 } from "@expo/vector-icons";
import { MOCK_CATEGORIES } from "@/mocks/categories";
import type { ComponentProps } from "react";

type CategoryIconName = ComponentProps<typeof FontAwesome6>["name"];

export type CategoryDisplay = {
  id: string;
  name: string;
  icon: CategoryIconName;
  iconBackgroundClassName: string;
  iconColor: string;
};

const DEFAULT_DISPLAY: Omit<CategoryDisplay, "id" | "name"> = {
  icon: "folder",
  iconBackgroundClassName: "bg-muted",
  iconColor: "#508A67",
};

const CATEGORY_DISPLAY_BY_ID: Record<
  string,
  Omit<CategoryDisplay, "id" | "name">
> = {
  "10000000-0000-4000-8000-000000000001": {
    icon: "money-bill-wave",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  "10000000-0000-4000-8000-000000000002": {
    icon: "laptop",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  "10000000-0000-4000-8000-000000000003": {
    icon: "utensils",
    iconBackgroundClassName: "bg-destructive/10",
    iconColor: "#DC2626",
  },
  "10000000-0000-4000-8000-000000000004": {
    icon: "car",
    iconBackgroundClassName: "bg-secondary",
    iconColor: "#508A67",
  },
  "10000000-0000-4000-8000-000000000005": {
    icon: "house",
    iconBackgroundClassName: "bg-brand/15",
    iconColor: "#508A67",
  },
  "10000000-0000-4000-8000-000000000006": {
    icon: "film",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  "10000000-0000-4000-8000-000000000007": {
    icon: "heart-pulse",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  "10000000-0000-4000-8000-000000000008": {
    icon: "ellipsis",
    iconBackgroundClassName: "bg-muted",
    iconColor: "#5f6e66",
  },
};

const categoryNameById = Object.fromEntries(
  MOCK_CATEGORIES.map((category) => [category.id, category.name]),
);

export function getCategoryDisplay(categoryId: string): CategoryDisplay {
  const styling = CATEGORY_DISPLAY_BY_ID[categoryId] ?? DEFAULT_DISPLAY;

  return {
    id: categoryId,
    name: categoryNameById[categoryId] ?? "Unknown",
    ...styling,
  };
}
