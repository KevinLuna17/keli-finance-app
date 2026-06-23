import type { CategoryIconKey } from "@/types/category-icon";
import { DEFAULT_CATEGORY_ICON_KEY } from "@/types/category-icon";
import { FontAwesome6 } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type CategoryIconName = ComponentProps<typeof FontAwesome6>["name"];

export type CategoryIconStyle = {
  icon: CategoryIconName;
  iconBackgroundClassName: string;
  iconColor: string;
};

export const CATEGORY_ICON_REGISTRY: Record<CategoryIconKey, CategoryIconStyle> = {
  food: {
    icon: "utensils",
    iconBackgroundClassName: "bg-destructive/10",
    iconColor: "#DC2626",
  },
  transport: {
    icon: "car",
    iconBackgroundClassName: "bg-secondary",
    iconColor: "#508A67",
  },
  housing: {
    icon: "house",
    iconBackgroundClassName: "bg-brand/15",
    iconColor: "#508A67",
  },
  utilities: {
    icon: "bolt",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  healthcare: {
    icon: "heart-pulse",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  shopping: {
    icon: "bag-shopping",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  entertainment: {
    icon: "film",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  education: {
    icon: "graduation-cap",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  travel: {
    icon: "plane",
    iconBackgroundClassName: "bg-secondary",
    iconColor: "#508A67",
  },
  subscriptions: {
    icon: "repeat",
    iconBackgroundClassName: "bg-muted",
    iconColor: "#5f6e66",
  },
  salary: {
    icon: "money-bill-wave",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  freelance: {
    icon: "laptop",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  bonus: {
    icon: "gift",
    iconBackgroundClassName: "bg-brand/15",
    iconColor: "#508A67",
  },
  investment: {
    icon: "chart-line",
    iconBackgroundClassName: "bg-primary/20",
    iconColor: "#508A67",
  },
  gift: {
    icon: "hand-holding-heart",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
  other: {
    icon: "ellipsis",
    iconBackgroundClassName: "bg-muted",
    iconColor: "#5f6e66",
  },
  folder: {
    icon: "folder",
    iconBackgroundClassName: "bg-muted",
    iconColor: "#508A67",
  },
  tag: {
    icon: "tag",
    iconBackgroundClassName: "bg-muted",
    iconColor: "#508A67",
  },
  bookmark: {
    icon: "bookmark",
    iconBackgroundClassName: "bg-secondary",
    iconColor: "#508A67",
  },
  star: {
    icon: "star",
    iconBackgroundClassName: "bg-accent/20",
    iconColor: "#B8860B",
  },
};

export function resolveCategoryIconStyle(
  iconKey: CategoryIconKey,
): CategoryIconStyle {
  return CATEGORY_ICON_REGISTRY[iconKey] ?? CATEGORY_ICON_REGISTRY[DEFAULT_CATEGORY_ICON_KEY];
}
