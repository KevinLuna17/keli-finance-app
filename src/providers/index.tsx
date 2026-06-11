import React from "react";
import { BackendSyncProvider } from "./BackendSyncProvider";
import { ClerkProvider } from "./ClerkProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <BackendSyncProvider>{children}</BackendSyncProvider>
    </ClerkProvider>
  );
};

export default AppProviders;
