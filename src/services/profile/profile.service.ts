import { apiRequest, apiRequestNoContent } from "@/lib/api/client";
import {
  GetToken,
  PROFILE_ENDPOINTS,
  Profile,
  UpdateProfileRequest,
} from "./profile.types";

export function getProfile(getToken: GetToken): Promise<Profile> {
  return apiRequest<Profile>(PROFILE_ENDPOINTS.base, {
    method: "GET",
    getToken,
  });
}

export function updateProfile(
  getToken: GetToken,
  payload: UpdateProfileRequest,
): Promise<Profile> {
  return apiRequest<Profile>(PROFILE_ENDPOINTS.base, {
    method: "PATCH",
    getToken,
    body: payload,
  });
}

/** Asks the backend to read the current photo from Clerk and store it. */
export function syncProfileImage(getToken: GetToken): Promise<Profile> {
  return apiRequest<Profile>(PROFILE_ENDPOINTS.syncImage, {
    method: "POST",
    getToken,
  });
}

/** Permanently deletes the authenticated user's account and data. */
export function deleteAccount(getToken: GetToken): Promise<void> {
  return apiRequestNoContent(PROFILE_ENDPOINTS.base, {
    method: "DELETE",
    getToken,
  });
}
