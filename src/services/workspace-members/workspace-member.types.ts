import type { GetToken } from "@/services/workspaces/workspace.types";

export type { GetToken };

export type WorkspaceMemberRole = "owner" | "member";

export type WorkspaceMember = {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: WorkspaceMemberRole;
};

export const WORKSPACE_MEMBER_ENDPOINTS = {
  list: (workspaceId: string) => `/workspaces/${workspaceId}/members`,
  remove: (workspaceId: string, memberId: string) =>
    `/workspaces/${workspaceId}/members/${memberId}`,
} as const;
