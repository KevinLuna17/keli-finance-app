import type { Router } from "expo-router";
import type { Href } from "expo-router";

type FinalizeNavigateArgs = {
  decorateUrl: (path: string) => string;
};

/** Shared navigate handler for signIn/signUp finalize callbacks. */
export function createAuthNavigateHandler(router: Router) {
  return ({ decorateUrl }: FinalizeNavigateArgs) => {
    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.replace(url as Href);
    }
  };
}
