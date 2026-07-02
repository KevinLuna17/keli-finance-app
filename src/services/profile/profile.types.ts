import type { GetToken } from "@/services/workspaces/workspace.types";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export type UpdateProfileRequest = {
  name: string;
  imageUrl?: string | null;
};

export const PROFILE_ENDPOINTS = {
  base: "/profile",
} as const;

export type { GetToken };
