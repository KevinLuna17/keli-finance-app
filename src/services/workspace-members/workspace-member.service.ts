import { apiRequest, apiRequestNoContent } from "@/lib/api/client";
import {
  GetToken,
  WORKSPACE_MEMBER_ENDPOINTS,
  WorkspaceMember,
} from "./workspace-member.types";

export function listWorkspaceMembers(
  getToken: GetToken,
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  return apiRequest<WorkspaceMember[]>(
    WORKSPACE_MEMBER_ENDPOINTS.list(workspaceId),
    {
      method: "GET",
      getToken,
    },
  );
}

export function removeWorkspaceMember(
  getToken: GetToken,
  workspaceId: string,
  memberId: string,
): Promise<void> {
  return apiRequestNoContent(
    WORKSPACE_MEMBER_ENDPOINTS.remove(workspaceId, memberId),
    {
      method: "DELETE",
      getToken,
    },
  );
}
