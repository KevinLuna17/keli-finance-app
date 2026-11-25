/**
 * Public URLs of the legal documents. Required by the App Store and Google Play.
 * Set them in `.env` (EXPO_PUBLIC_TERMS_URL / EXPO_PUBLIC_PRIVACY_URL).
 */
export const LEGAL_LINKS = {
  terms: process.env.EXPO_PUBLIC_TERMS_URL ?? "",
  privacy: process.env.EXPO_PUBLIC_PRIVACY_URL ?? "",
} as const;

export type LegalDocument = keyof typeof LEGAL_LINKS;

if (__DEV__ && (!LEGAL_LINKS.terms || !LEGAL_LINKS.privacy)) {
  console.warn(
    "Legal links are missing. Add EXPO_PUBLIC_TERMS_URL and EXPO_PUBLIC_PRIVACY_URL to your .env file before publishing.",
  );
}
