/** First word of a person's name, trimmed. Null when there is no usable name. */
export function getFirstName(name: string | null | undefined): string | null {
  const trimmed = name?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.split(/\s+/)[0] ?? null;
}
