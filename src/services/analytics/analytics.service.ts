import { apiRequest } from "@/lib/api/client";
import {
  ANALYTICS_ENDPOINTS,
  AnalyticsSummary,
  CategoryAnalyticsItem,
  GetToken,
  MonthlyAnalyticsItem,
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

function withWorkspaceQuery(workspaceId: string): string {
  return buildQueryString({ workspaceId });
}

export function getDashboard(
  getToken: GetToken,
  workspaceId: string,
): Promise<WorkspaceDashboard> {
  return apiRequest<WorkspaceDashboard>(
    `${ANALYTICS_ENDPOINTS.dashboard}${withWorkspaceQuery(workspaceId)}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function getSummary(
  getToken: GetToken,
  workspaceId: string,
): Promise<AnalyticsSummary> {
  return apiRequest<AnalyticsSummary>(
    `${ANALYTICS_ENDPOINTS.summary}${withWorkspaceQuery(workspaceId)}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function getMonthly(
  getToken: GetToken,
  workspaceId: string,
): Promise<MonthlyAnalyticsItem[]> {
  return apiRequest<MonthlyAnalyticsItem[]>(
    `${ANALYTICS_ENDPOINTS.monthly}${withWorkspaceQuery(workspaceId)}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function getExpensesByCategory(
  getToken: GetToken,
  workspaceId: string,
): Promise<CategoryAnalyticsItem[]> {
  return apiRequest<CategoryAnalyticsItem[]>(
    `${ANALYTICS_ENDPOINTS.expensesByCategory}${withWorkspaceQuery(workspaceId)}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function getIncomeByCategory(
  getToken: GetToken,
  workspaceId: string,
): Promise<CategoryAnalyticsItem[]> {
  return apiRequest<CategoryAnalyticsItem[]>(
    `${ANALYTICS_ENDPOINTS.incomeByCategory}${withWorkspaceQuery(workspaceId)}`,
    {
      method: "GET",
      getToken,
    },
  );
}
