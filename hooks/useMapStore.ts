// useMapStore.ts
import { create } from "zustand";

type MapStore = {
  activeMarkerId: string | null;
  setActiveMarkerId: (id: string | null) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  activeMarkerId: null,
  setActiveMarkerId: (id) => set({ activeMarkerId: id }),
}));
