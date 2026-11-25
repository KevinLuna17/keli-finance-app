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

export type CreateCategoryRequest = {
  name: string;
  type: CategoryType;
  iconKey?: CategoryIconKey;
};

/** Category type cannot change after creation. */
export type UpdateCategoryRequest = {
  name?: string;
  iconKey?: CategoryIconKey;
};

export const CATEGORY_ERROR_CODES = {
  nameTaken: "CATEGORY_NAME_TAKEN",
  inUse: "CATEGORY_IN_USE",
  lastOfType: "LAST_CATEGORY_OF_TYPE",
  reassignInvalid: "CATEGORY_REASSIGN_INVALID",
} as const;

export const CATEGORY_ENDPOINTS = {
  list: "/categories",
  byId: (id: string) => `/categories/${id}`,
} as const;

export type { GetToken };
