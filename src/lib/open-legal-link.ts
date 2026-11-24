import { LEGAL_LINKS, type LegalDocument } from "@/config/legal-links";
import * as WebBrowser from "expo-web-browser";

export async function openLegalLink(document: LegalDocument): Promise<void> {
  const url = LEGAL_LINKS[document];

  if (!url) {
    return;
  }

  await WebBrowser.openBrowserAsync(url);
}
