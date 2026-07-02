import { ApiError } from "@/lib/api/client";
import {
  acceptInvitation,
  declineInvitation,
  listInvitations,
} from "@/services/invitations/invitation.service";
import type { WorkspaceInvitation } from "@/services/invitations/invitation.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseInvitationsResult = {
  invitations: WorkspaceInvitation[];
  isLoading: boolean;
  error: string | null;
  actingInvitationId: string | null;
  refresh: () => Promise<void>;
  accept: (invitationId: string) => Promise<void>;
  decline: (invitationId: string) => Promise<void>;
};

export function useInvitations(): UseInvitationsResult {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingInvitationId, setActingInvitationId] = useState<string | null>(
    null,
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listInvitations(() => getTokenRef.current());
      setInvitations(data);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load invitations",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const accept = useCallback(
    async (invitationId: string) => {
      setActingInvitationId(invitationId);
      setError(null);

      try {
        await acceptInvitation(() => getTokenRef.current(), invitationId);
        setInvitations((current) =>
          current.filter((invitation) => invitation.id !== invitationId),
        );
      } catch (actionError) {
        setError(
          actionError instanceof ApiError
            ? actionError.message
            : "Could not accept invitation",
        );
        throw actionError;
      } finally {
        setActingInvitationId(null);
      }
    },
    [],
  );

  const decline = useCallback(
    async (invitationId: string) => {
      setActingInvitationId(invitationId);
      setError(null);

      try {
        await declineInvitation(() => getTokenRef.current(), invitationId);
        setInvitations((current) =>
          current.filter((invitation) => invitation.id !== invitationId),
        );
      } catch (actionError) {
        setError(
          actionError instanceof ApiError
            ? actionError.message
            : "Could not decline invitation",
        );
        throw actionError;
      } finally {
        setActingInvitationId(null);
      }
    },
    [],
  );

  return {
    invitations,
    isLoading,
    error,
    actingInvitationId,
    refresh,
    accept,
    decline,
  };
}
