const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Add EXPO_PUBLIC_API_URL to your .env file");
}

export const API_URL = apiUrl.replace(/\/$/, "");
