import React from "react";
import { BackendSyncProvider } from "./BackendSyncProvider";
import { ClerkProvider } from "./ClerkProvider";
import I18nProvider from "./I18nProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nProvider>
      <ClerkProvider>
        <BackendSyncProvider>{children}</BackendSyncProvider>
      </ClerkProvider>
    </I18nProvider>
  );
};

export default AppProviders;
