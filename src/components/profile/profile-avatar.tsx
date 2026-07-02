import type { Profile } from "@/services/profile/profile.types";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type ProfileAvatarProps = {
  profile: Pick<Profile, "name" | "email" | "imageUrl">;
  size?: number;
};

function getInitials(name: string | null, email: string): string {
  const source = name?.trim() || email;

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function ProfileAvatar({ profile, size = 96 }: ProfileAvatarProps) {
  const { t } = useTranslation();
  const initials = useMemo(
    () => getInitials(profile.name, profile.email),
    [profile.email, profile.name],
  );

  if (profile.imageUrl) {
    return (
      <Image
        source={{ uri: profile.imageUrl }}
        accessibilityLabel={t("profileScreen.photoLabel")}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full bg-brand"
      style={{ width: size, height: size }}
    >
      <Text
        className="font-bold text-brand-foreground"
        style={{ fontSize: size * 0.32 }}
      >
        {initials}
      </Text>
    </View>
  );
}
