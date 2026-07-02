import { apiRequest, apiRequestNoContent } from "@/lib/api/client";
import {
  CreateWorkspaceRequest,
  CurrentWorkspace,
  GetToken,
  UpdateWorkspaceCurrencyRequest,
  UpdateWorkspaceRequest,
  WORKSPACE_ENDPOINTS,
  Workspace,
} from "./workspace.types";

export function getCurrentWorkspace(
  getToken: GetToken,
): Promise<CurrentWorkspace> {
  return apiRequest<CurrentWorkspace>(WORKSPACE_ENDPOINTS.current, {
    method: "GET",
    getToken,
  });
}

export function listWorkspaces(getToken: GetToken): Promise<Workspace[]> {
  return apiRequest<Workspace[]>(WORKSPACE_ENDPOINTS.base, {
    method: "GET",
    getToken,
  });
}

export function createWorkspace(
  getToken: GetToken,
  payload: CreateWorkspaceRequest,
): Promise<Workspace> {
  return apiRequest<Workspace>(WORKSPACE_ENDPOINTS.base, {
    method: "POST",
    getToken,
    body: payload,
  });
}

export function updateWorkspace(
  getToken: GetToken,
  workspaceId: string,
  payload: UpdateWorkspaceRequest,
): Promise<Workspace> {
  return apiRequest<Workspace>(WORKSPACE_ENDPOINTS.byId(workspaceId), {
    method: "PATCH",
    getToken,
    body: payload,
  });
}

export function updateWorkspaceCurrency(
  getToken: GetToken,
  workspaceId: string,
  payload: UpdateWorkspaceCurrencyRequest,
): Promise<Workspace> {
  return apiRequest<Workspace>(WORKSPACE_ENDPOINTS.currency(workspaceId), {
    method: "PATCH",
    getToken,
    body: payload,
  });
}

export function deleteWorkspace(
  getToken: GetToken,
  workspaceId: string,
): Promise<void> {
  return apiRequestNoContent(WORKSPACE_ENDPOINTS.byId(workspaceId), {
    method: "DELETE",
    getToken,
  });
}
