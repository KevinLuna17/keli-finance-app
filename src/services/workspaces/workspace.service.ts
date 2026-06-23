import { apiRequest } from "@/lib/api/client";
import {
  CurrentWorkspace,
  GetToken,
  WORKSPACE_ENDPOINTS,
} from "./workspace.types";

export function getCurrentWorkspace(
  getToken: GetToken,
): Promise<CurrentWorkspace> {
  return apiRequest<CurrentWorkspace>(WORKSPACE_ENDPOINTS.current, {
    method: "GET",
    getToken,
  });
}
