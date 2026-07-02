import type { GetToken } from "@/services/workspaces/workspace.types";

export type Preferences = {
  language: string;
  timezone: string;
};

export type UpdatePreferencesRequest = {
  language: string;
};

export const PREFERENCES_ENDPOINTS = {
  base: "/preferences",
} as const;

export type { GetToken };
