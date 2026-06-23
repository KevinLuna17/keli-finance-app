import { ApiError } from "@/lib/api/client";
import {
  listWorkspaceMembers,
  removeWorkspaceMember,
} from "@/services/workspace-members/workspace-member.service";
import type { WorkspaceMember } from "@/services/workspace-members/workspace-member.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

type UseWorkspaceMembersOptions = {
  workspaceId: string | undefined;
  enabled?: boolean;
};

type UseWorkspaceMembersResult = {
  members: WorkspaceMember[];
  owner: WorkspaceMember | null;
  regularMembers: WorkspaceMember[];
  isLoading: boolean;
  error: string | null;
  removingMemberId: string | null;
  refresh: () => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
};

export function useWorkspaceMembers({
  workspaceId,
  enabled = true,
}: UseWorkspaceMembersOptions): UseWorkspaceMembersResult {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(workspaceId && enabled));
  const [error, setError] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!workspaceId || !enabled) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listWorkspaceMembers(
        () => getTokenRef.current(),
        workspaceId,
      );
      setMembers(data);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load workspace members",
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled, workspaceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!workspaceId) {
        return;
      }

      setRemovingMemberId(memberId);
      setError(null);

      try {
        await removeWorkspaceMember(
          () => getTokenRef.current(),
          workspaceId,
          memberId,
        );
        setMembers((current) => current.filter((member) => member.id !== memberId));
      } catch (actionError) {
        setError(
          actionError instanceof ApiError
            ? actionError.message
            : "Could not remove member",
        );
        throw actionError;
      } finally {
        setRemovingMemberId(null);
      }
    },
    [workspaceId],
  );

  const owner = members.find((member) => member.role === "owner") ?? null;
  const regularMembers = members.filter((member) => member.role === "member");

  return {
    members,
    owner,
    regularMembers,
    isLoading,
    error,
    removingMemberId,
    refresh,
    removeMember,
  };
}
