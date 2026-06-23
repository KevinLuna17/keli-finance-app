import { apiRequest } from "@/lib/api/client";
import {
  CATEGORY_ENDPOINTS,
  Category,
  GetToken,
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
