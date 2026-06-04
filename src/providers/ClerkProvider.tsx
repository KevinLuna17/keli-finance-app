import { ClerkLoaded, ClerkProvider as ClerkProviderBase } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <ClerkProviderBase publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProviderBase>
  );
}
