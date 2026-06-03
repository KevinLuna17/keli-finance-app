import type { Href } from "expo-router";

/**
 * Clerk can attach a `session.currentTask` after sign-in when the dashboard
 * requires extra steps (e.g. choose-organization, complete profile).
 * This is Clerk's session task — not the same as a custom Keli onboarding UI.
 */
export type ClerkSessionTask = {
  key?: string;
  type?: string;
  [key: string]: unknown;
};

export function hasPendingSessionTask(
  session?: { currentTask?: unknown } | null,
): boolean {
  return session?.currentTask != null;
}

export function getSessionTaskLabel(task: unknown): string {
  if (task == null) {
    return "Additional setup is required for your account.";
  }

  if (typeof task === "string") {
    return formatTaskKey(task);
  }

  const record = task as ClerkSessionTask;
  const key = record.key ?? record.type;
  if (typeof key === "string") {
    return formatTaskKey(key);
  }

  return "Additional setup is required for your account.";
}

function formatTaskKey(key: string): string {
  const labels: Record<string, string> = {
    "choose-organization": "Choose an organization to continue.",
    "complete-profile": "Complete your profile to continue.",
    "setup-mfa": "Set up two-factor authentication to continue.",
  };

  return (
    labels[key] ??
    "Your account needs one more step in Clerk before you can use the app."
  );
}

export function getSessionTaskHref(): Href {
  return "/(home)/session-task" as Href;
}
