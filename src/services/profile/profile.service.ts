import { apiRequest } from "@/lib/api/client";
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
