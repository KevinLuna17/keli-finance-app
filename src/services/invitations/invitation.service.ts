import { apiRequest } from "@/lib/api/client";
import {
  CreateWorkspaceInvitationRequest,
  GetToken,
  INVITATION_ENDPOINTS,
  WorkspaceInvitation,
} from "./invitation.types";

export function createWorkspaceInvitation(
  getToken: GetToken,
  workspaceId: string,
  payload: CreateWorkspaceInvitationRequest,
): Promise<WorkspaceInvitation> {
  return apiRequest<WorkspaceInvitation>(
    INVITATION_ENDPOINTS.workspaceInvitations(workspaceId),
    {
      method: "POST",
      getToken,
      body: payload,
    },
  );
}

export function listInvitations(
  getToken: GetToken,
): Promise<WorkspaceInvitation[]> {
  return apiRequest<WorkspaceInvitation[]>(INVITATION_ENDPOINTS.base, {
    method: "GET",
    getToken,
  });
}

export function acceptInvitation(
  getToken: GetToken,
  invitationId: string,
): Promise<WorkspaceInvitation> {
  return apiRequest<WorkspaceInvitation>(
    INVITATION_ENDPOINTS.accept(invitationId),
    {
      method: "POST",
      getToken,
    },
  );
}

export function declineInvitation(
  getToken: GetToken,
  invitationId: string,
): Promise<WorkspaceInvitation> {
  return apiRequest<WorkspaceInvitation>(
    INVITATION_ENDPOINTS.decline(invitationId),
    {
      method: "POST",
      getToken,
    },
  );
}
