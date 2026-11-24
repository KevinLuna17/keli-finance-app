import { deleteAccount } from "@/services/profile/profile.service";
import { useAuth, useClerk } from "@clerk/expo";
import { useState } from "react";

export function useDeleteAccount() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const confirmDeletion = async () => {
    setErrorKey(null);
    setIsDeleting(true);

    try {
      await deleteAccount(() => getToken());
    } catch {
      setErrorKey("deleteAccount.error");
      setIsDeleting(false);
      return;
    }

    try {
      await signOut();
    } catch {
      // The Clerk user no longer exists, so the session is already invalid.
    }
  };

  return {
    confirmDeletion,
    isDeleting,
    errorKey,
  };
}
