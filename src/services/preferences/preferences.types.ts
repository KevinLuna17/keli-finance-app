import type { GetToken } from "@/services/workspaces/workspace.types";

export type Preferences = {
  language: string;
  timezone: string;
  onboardingCompletedAt: string | null;
  /** Computed by the backend: false once completed or when transactions exist. */
  showOnboarding: boolean;
};

export type UpdatePreferencesRequest = {
  language: string;
};

export const PREFERENCES_ENDPOINTS = {
  base: "/preferences",
  completeOnboarding: "/preferences/onboarding/complete",
} as const;

export type { GetToken };
