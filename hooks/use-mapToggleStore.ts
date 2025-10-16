/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { legendMarker } from "@/lib/constants";
import { capitalize } from "@/lib/utils";

type MapToggleStore = {
  [key: `show${string}`]: boolean;
  toggleLayer: (key: string) => void;
  setLayer: (key: string, value: boolean) => void;
};

const initialState = legendMarker.reduce((acc, { key }) => {
  acc[`show${capitalize(key)}`] = true;
  return acc;
}, {} as Record<string, boolean>);

export const useMapToggleStore = create<MapToggleStore>((set) => ({
  ...initialState,

  toggleLayer: (key: string) => {
    const toggleKey = `show${capitalize(key)}` as keyof MapToggleStore;
    set((state: any) => ({
      [toggleKey]: !state[toggleKey],
    }));
  },

  setLayer: (key: string, value: boolean) => {
    const toggleKey = `show${capitalize(key)}` as keyof MapToggleStore;
    set(() => ({
      [toggleKey]: value,
    }));
  },
}));
