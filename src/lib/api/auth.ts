import type { BackendUser } from "@/types/api";
import { apiRequest } from "./client";

type GetToken = () => Promise<string | null>;

export function syncUser(getToken: GetToken): Promise<BackendUser> {
  return apiRequest<BackendUser>("/auth/sync", {
    method: "POST",
    getToken,
  });
}
