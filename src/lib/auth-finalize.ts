import type { Router } from "expo-router";
import type { Href } from "expo-router";
import {
  getSessionTaskHref,
  hasPendingSessionTask,
} from "@/lib/clerk-session-task";

type FinalizeSession = {
  currentTask?: unknown;
} | null;

type FinalizeNavigateArgs = {
  session?: FinalizeSession;
  decorateUrl: (path: string) => string;
};

/** Shared navigate handler for signIn/signUp finalize callbacks. */
export function createAuthNavigateHandler(router: Router) {
  return ({ session, decorateUrl }: FinalizeNavigateArgs) => {
    if (hasPendingSessionTask(session)) {
      router.replace(getSessionTaskHref());
      return;
    }

    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.replace(url as Href);
    }
  };
}
