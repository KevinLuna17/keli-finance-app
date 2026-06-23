export type GetToken = () => Promise<string | null>;

export type WorkspaceType = "personal" | "shared";

export type WorkspaceMemberRole = "owner" | "member";

export type CurrentWorkspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  role: WorkspaceMemberRole;
};

export const WORKSPACE_ENDPOINTS = {
  current: "/workspaces/current",
} as const;
