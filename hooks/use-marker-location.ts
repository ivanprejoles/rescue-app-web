// stores/locationStore.ts
import { create } from "zustand";

interface LocationStore {
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
}));
