import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

type WorkspaceStore = {
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (workspaceId: string) => void;
  reset: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      currentWorkspaceId: null,
      setCurrentWorkspaceId: (currentWorkspaceId) => set({ currentWorkspaceId }),
      reset: () => set({ currentWorkspaceId: null }),
    }),
    {
      name: "keli-workspace-store",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ currentWorkspaceId: state.currentWorkspaceId }),
    },
  ),
);

export function selectCurrentWorkspaceId(state: WorkspaceStore): string | null {
  return state.currentWorkspaceId;
}

export function selectSetCurrentWorkspaceId(
  state: WorkspaceStore,
): (workspaceId: string) => void {
  return state.setCurrentWorkspaceId;
}
