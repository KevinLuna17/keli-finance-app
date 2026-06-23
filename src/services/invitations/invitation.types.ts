import type { GetToken } from "@/services/workspaces/workspace.types";
import type { WorkspaceType } from "@/services/workspaces/workspace.types";

export type { GetToken };

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: WorkspaceType;
  invitedEmail: string;
  invitedByUserId: string;
  invitedByName: string | null;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateWorkspaceInvitationRequest = {
  email: string;
};

export const INVITATION_ENDPOINTS = {
  base: "/invitations",
  accept: (id: string) => `/invitations/${id}/accept`,
  decline: (id: string) => `/invitations/${id}/decline`,
  workspaceInvitations: (workspaceId: string) =>
    `/workspaces/${workspaceId}/invitations`,
} as const;
