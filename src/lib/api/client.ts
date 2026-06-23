import { API_URL } from "./config";
import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "@/types/api";

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

async function parseErrorResponse(
  response: Response,
): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ApiErrorResponse;

    return new ApiError(
      payload.error?.message ?? "Request failed",
      response.status,
      payload.error?.code ?? "REQUEST_FAILED",
    );
  } catch {
    return new ApiError("Request failed", response.status, "REQUEST_FAILED");
  }
}

async function authorizedFetch(
  path: string,
  { method = "GET", body, getToken }: ApiRequestOptions,
): Promise<Response> {
  const token = await getToken();

  if (!token) {
    throw new ApiError("No auth token available", 401, "NO_TOKEN");
  }

  return fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<T> {
  const response = await authorizedFetch(path, options);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const payload = (await response.json()) as ApiSuccessResponse<T>;
  return payload.data;
}

export async function apiPaginatedRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<ApiPaginatedResponse<T>> {
  const response = await authorizedFetch(path, options);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return (await response.json()) as ApiPaginatedResponse<T>;
}

export async function apiRequestNoContent(
  path: string,
  options: ApiRequestOptions,
): Promise<void> {
  const response = await authorizedFetch(path, options);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }
}
