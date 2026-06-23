import { apiRequest } from "@/lib/api/client";
import {
  ANALYTICS_ENDPOINTS,
  GetToken,
  WorkspaceDashboard,
} from "./analytics.types";

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

export function getDashboard(
  getToken: GetToken,
  workspaceId: string,
): Promise<WorkspaceDashboard> {
  const query = buildQueryString({ workspaceId });

  return apiRequest<WorkspaceDashboard>(
    `${ANALYTICS_ENDPOINTS.dashboard}${query}`,
    {
      method: "GET",
      getToken,
    },
  );
}
