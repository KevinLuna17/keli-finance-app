import * as Localization from "expo-localization";

const FALLBACK_REGION = "US";
const FALLBACK_TIMEZONE = "UTC";

/**
 * Returns the device's ISO 3166-1 alpha-2 region code (e.g. "US", "CO", "MX").
 * Falls back to "US" when the region cannot be determined.
 */
export function detectDeviceRegion(): string {
  const locale = Localization.getLocales()[0];
  return locale?.regionCode ?? FALLBACK_REGION;
}

/**
 * Returns the device's IANA timezone identifier (e.g. "America/Bogota").
 * Falls back to "UTC" when the timezone cannot be determined.
 */
export function detectDeviceTimezone(): string {
  const calendars = Localization.getCalendars();
  return calendars[0]?.timeZone ?? FALLBACK_TIMEZONE;
}
