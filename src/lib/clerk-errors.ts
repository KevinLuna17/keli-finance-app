type ClerkErrorShape = {
  errors?: { message?: string; meta?: { paramName?: string } }[];
  message?: string;
};

export function getClerkErrorMessage(error: unknown): string {
  const clerkError = error as ClerkErrorShape;

  return (
    clerkError.errors?.[0]?.message ??
    clerkError.message ??
    "Something went wrong. Please try again."
  );
}

/** Clerk already maps these to errors.fields — avoid duplicating in a banner. */
export function isFieldLevelClerkError(error: unknown): boolean {
  const clerkError = error as ClerkErrorShape;
  return Boolean(clerkError.errors?.[0]?.meta?.paramName);
}
