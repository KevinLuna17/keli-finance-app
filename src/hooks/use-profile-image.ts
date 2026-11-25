import { getApiErrorMessage } from "@/lib/api/api-error-message";
import { syncProfileImage } from "@/services/profile/profile.service";
import type { Profile } from "@/services/profile/profile.types";
import { useAuth, useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import i18n from "@/i18n";

/** Clerk accepts up to 10 MB; keep a margin for the base64 overhead. */
const MAX_IMAGE_BYTES = 7 * 1024 * 1024;

type UseProfileImageOptions = {
  onUpdated?: (profile: Profile) => void | Promise<void>;
};

/**
 * Uploads or removes the profile photo. The image goes directly to Clerk;
 * the backend then reads the resulting URL from Clerk, never from the app.
 */
export function useProfileImage({ onUpdated }: UseProfileImageOptions = {}) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyImage = useCallback(
    async (file: string | null) => {
      if (!user) {
        setError(i18n.t("profileScreen.photoErrors.generic"));
        return;
      }

      setError(null);
      setIsUpdating(true);

      try {
        await user.setProfileImage({ file });
        await user.reload();
        const profile = await syncProfileImage(() => getToken());
        await onUpdated?.(profile);
      } catch (updateError) {
        if (__DEV__) {
          console.warn("[ProfileImage] update failed:", updateError);
        }
        setError(getApiErrorMessage(updateError, "profileScreen.photoErrors.generic"));
      } finally {
        setIsUpdating(false);
      }
    },
    [getToken, onUpdated, user],
  );

  const pickImage = useCallback(async () => {
    setError(null);

    // iOS 14+ and Android 13+ use the system picker, which needs no permission.
    // Older versions ask here; denying is not an error.
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError(i18n.t("profileScreen.photoErrors.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    const asset = result.canceled ? null : result.assets[0];

    if (!asset?.base64) {
      return;
    }

    // base64 is ~4/3 of the original size.
    if ((asset.base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      setError(i18n.t("profileScreen.photoErrors.tooLarge"));
      return;
    }

    const mimeType = asset.mimeType ?? "image/jpeg";
    await applyImage(`data:${mimeType};base64,${asset.base64}`);
  }, [applyImage]);

  const removeImage = useCallback(() => applyImage(null), [applyImage]);

  return {
    pickImage,
    removeImage,
    isUpdating,
    error,
    dismissError: () => setError(null),
  };
}
