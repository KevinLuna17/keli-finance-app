import type { GetToken } from "@/services/workspaces/workspace.types";
import type { CategoryIconKey } from "@/types/category-icon";

export type CategoryType = "income" | "expense";

export type Category = {
  id: string;
  workspaceId: string;
  name: string;
  type: CategoryType;
  iconKey?: CategoryIconKey | string;
  createdAt: string;
  updatedAt: string | null;
};

export const CATEGORY_ENDPOINTS = {
  list: "/categories",
} as const;

export type { GetToken };
