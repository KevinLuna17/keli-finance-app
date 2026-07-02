import { apiRequest } from "@/lib/api/client";
import {
  GetToken,
  Preferences,
  PREFERENCES_ENDPOINTS,
  UpdatePreferencesRequest,
} from "./preferences.types";

export function getPreferences(getToken: GetToken): Promise<Preferences> {
  return apiRequest<Preferences>(PREFERENCES_ENDPOINTS.base, {
    method: "GET",
    getToken,
  });
}

export function updatePreferences(
  getToken: GetToken,
  payload: UpdatePreferencesRequest,
): Promise<Preferences> {
  return apiRequest<Preferences>(PREFERENCES_ENDPOINTS.base, {
    method: "PATCH",
    getToken,
    body: payload,
  });
}
