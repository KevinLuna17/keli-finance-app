import type { BackendUser } from "@/types/api";
import { apiRequest } from "./client";

type GetToken = () => Promise<string | null>;

type SyncUserPayload = {
  region: string;
  timezone: string;
};

export function syncUser(
  getToken: GetToken,
  payload: SyncUserPayload,
): Promise<BackendUser> {
  return apiRequest<BackendUser>("/auth/sync", {
    method: "POST",
    getToken,
    body: payload,
  });
}
