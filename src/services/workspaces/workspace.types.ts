export type GetToken = () => Promise<string | null>;

export type WorkspaceType = "personal" | "shared";

export type WorkspaceMemberRole = "owner" | "member";

export type CurrentWorkspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  role: WorkspaceMemberRole;
};

export type Workspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  role: WorkspaceMemberRole;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateWorkspaceRequest = {
  name: string;
};

export type UpdateWorkspaceRequest = {
  name: string;
};

export const WORKSPACE_ENDPOINTS = {
  base: "/workspaces",
  current: "/workspaces/current",
  byId: (id: string) => `/workspaces/${id}`,
} as const;
