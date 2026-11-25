import { apiRequest, apiRequestNoContent } from "@/lib/api/client";
import {
  CATEGORY_ENDPOINTS,
  Category,
  CreateCategoryRequest,
  GetToken,
  UpdateCategoryRequest,
} from "./category.types";

function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function listCategories(
  getToken: GetToken,
  workspaceId: string,
): Promise<Category[]> {
  const query = buildQueryString({ workspaceId });

  return apiRequest<Category[]>(`${CATEGORY_ENDPOINTS.list}${query}`, {
    method: "GET",
    getToken,
  });
}

export function createCategory(
  getToken: GetToken,
  workspaceId: string,
  payload: CreateCategoryRequest,
): Promise<Category> {
  const query = buildQueryString({ workspaceId });

  return apiRequest<Category>(`${CATEGORY_ENDPOINTS.list}${query}`, {
    method: "POST",
    getToken,
    body: payload,
  });
}

export function updateCategory(
  getToken: GetToken,
  categoryId: string,
  payload: UpdateCategoryRequest,
): Promise<Category> {
  return apiRequest<Category>(CATEGORY_ENDPOINTS.byId(categoryId), {
    method: "PATCH",
    getToken,
    body: payload,
  });
}

/**
 * Deletes a category. When it has transactions, pass `reassignToCategoryId`
 * (same type) so they are moved before deleting; otherwise the API answers
 * 409 CATEGORY_IN_USE.
 */
export function deleteCategory(
  getToken: GetToken,
  categoryId: string,
  reassignToCategoryId?: string,
): Promise<void> {
  const query = buildQueryString({ reassignToCategoryId });

  return apiRequestNoContent(`${CATEGORY_ENDPOINTS.byId(categoryId)}${query}`, {
    method: "DELETE",
    getToken,
  });
}
