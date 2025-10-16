/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapEvacuationCenter, Report } from "@/lib/types";
import { create } from "zustand";

type LocationModalState =
  | {
      isOpen: boolean;
      mode: "marker";
      initialData: Report | null;
      openModal: (mode: "marker", data?: any) => void;
      closeModal: () => void;
      setInitialData: (data: Report) => void;
    }
  | {
      isOpen: boolean;
      mode: "evacuation";
      initialData: MapEvacuationCenter | null;
      openModal: (mode: "evacuation", data?: any) => void;
      closeModal: () => void;
      setInitialData: (data: MapEvacuationCenter) => void;
    };

export const useUpdateAddMapModal = create<LocationModalState>((set) => ({
  isOpen: false,
  mode: "marker",
  initialData: null,
  openModal: (mode, data = null) =>
    set({
      isOpen: true,
      mode,
      initialData: data,
    }),
  closeModal: () => set({ isOpen: false }),
  setInitialData: (data) => set({ initialData: data }),
}));
