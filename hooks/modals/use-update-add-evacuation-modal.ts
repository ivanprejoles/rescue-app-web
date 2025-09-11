import { create } from "zustand";
import { RawEvacuationCenter } from "@/lib/types";

interface EvacuationCenterModalState {
  isOpen: boolean;
  evacuationCenter?: RawEvacuationCenter | null;
  mode: "add" | "edit";
  onSave?: (
    center: Omit<RawEvacuationCenter, "id" | "createdAt" | "barangays">
  ) => Promise<void>;
  openModal: (
    mode: "add" | "edit",
    evacuationCenter?: RawEvacuationCenter | null,
    onSave?: (
      center: Omit<RawEvacuationCenter, "id" | "createdAt" | "barangays">
    ) => Promise<void>
  ) => void;
  closeModal: () => void;
}

export const useEvacuationCenterModalStore = create<EvacuationCenterModalState>(
  (set) => ({
    isOpen: false,
    evacuationCenter: null,
    mode: "add",
    onSave: undefined,
    openModal: (mode, evacuationCenter = null, onSave) =>
      set({ isOpen: true, mode, evacuationCenter, onSave }),
    closeModal: () =>
      set({
        isOpen: false,
        evacuationCenter: null,
        mode: "add",
        onSave: undefined,
      }),
  })
);
