import { API_URL } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type GetToken = () => Promise<string | null>;

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  getToken: GetToken;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, getToken }: ApiRequestOptions,
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new ApiError("No auth token available", 401, "NO_TOKEN");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;

    throw new ApiError(
      errorPayload.error?.message ?? "Request failed",
      response.status,
      errorPayload.error?.code ?? "REQUEST_FAILED",
    );
  }

  return (payload as ApiSuccessResponse<T>).data;
}
