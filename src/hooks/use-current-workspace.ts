import { useBackendSync } from "@/hooks/useBackendSync";
import {
  selectCurrentWorkspaceId,
  useWorkspaceStore,
} from "@/stores/workspace-store";

export function useCurrentWorkspaceId(): string | undefined {
  const currentWorkspaceId = useWorkspaceStore(selectCurrentWorkspaceId);
  return currentWorkspaceId ?? undefined;
}

export function useSetCurrentWorkspaceId(): (workspaceId: string) => void {
  return useWorkspaceStore((state) => state.setCurrentWorkspaceId);
}

export function useCurrentWorkspace() {
  return useBackendSync().currentWorkspace;
}
