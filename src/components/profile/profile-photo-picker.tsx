import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { useProfileImage } from "@/hooks/use-profile-image";
import type { Profile } from "@/services/profile/profile.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type ProfilePhotoPickerProps = {
  profile: Profile;
  disabled?: boolean;
};

/** Avatar with change / remove actions. Changes are saved immediately. */
export function ProfilePhotoPicker({ profile, disabled = false }: ProfilePhotoPickerProps) {
  const { t } = useTranslation();
  // Shows the new photo right away without reloading the whole form.
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);
  const { pickImage, removeImage, isUpdating, error, dismissError } = useProfileImage({
    onUpdated: (updated) => setImageUrl(updated.imageUrl),
  });
  const isDisabled = disabled || isUpdating;

  const confirmRemove = () => {
    Alert.alert(
      t("profileScreen.removePhotoTitle"),
      t("profileScreen.removePhotoMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("profileScreen.removePhoto"),
          style: "destructive",
          onPress: () => {
            void removeImage();
          },
        },
      ],
    );
  };

  return (
    <View className="mb-6 items-center">
      <Pressable
        onPress={() => void pickImage()}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={t("profileScreen.changePhoto")}
      >
        <View>
          <ProfileAvatar profile={{ ...profile, imageUrl }} size={104} />
          <View className="absolute bottom-0 right-0 size-9 items-center justify-center rounded-full border-2 border-card bg-brand">
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <FontAwesome6 name="camera" size={14} color="white" />
            )}
          </View>
        </View>
      </Pressable>

      <View className="mt-3 flex-row gap-6">
        <Pressable
          onPress={() => void pickImage()}
          disabled={isDisabled}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text className="text-sm font-semibold text-brand dark:text-primary">
            {t("profileScreen.changePhoto")}
          </Text>
        </Pressable>
        {imageUrl ? (
          <Pressable
            onPress={confirmRemove}
            disabled={isDisabled}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text className="text-sm font-semibold text-destructive">
              {t("profileScreen.removePhoto")}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Pressable
          className="mt-3 rounded-2xl bg-destructive/10 px-4 py-3"
          onPress={dismissError}
          accessibilityRole="button"
        >
          <Text className="text-center text-sm text-destructive">{error}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
