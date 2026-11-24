import type { Href, useRouter } from "expo-router";

type Router = ReturnType<typeof useRouter>;

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
