export type FieldVisualState = {
  focused: boolean;
  hasError: boolean;
};

export const INPUT_ICON_ACTIVE = "#508A67";
export const INPUT_ICON_MUTED = "#5f6e66";
export const INPUT_ICON_ERROR = "#DC2626";
export const INPUT_PLACEHOLDER_COLOR = "#5f6e66";

export function getInputIconColor({
  focused,
  hasError,
}: FieldVisualState): string {
  if (hasError) return INPUT_ICON_ERROR;
  if (focused) return INPUT_ICON_ACTIVE;
  return INPUT_ICON_MUTED;
}

export function fieldContainerClass({
  hasError,
  focused,
}: FieldVisualState): string {
  const base = "flex-row items-center h-14 rounded-2xl border px-4";
  if (hasError) {
    return `${base} border border-destructive`;
  }
  if (focused) {
    return `${base} border-2 border-primary`;
  }
  return `${base} border border-border`;
}
