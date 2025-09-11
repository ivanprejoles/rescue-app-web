import { RawBarangay } from "@/lib/types";
import { create } from "zustand";

interface BarangayModalState {
  isOpen: boolean;
  barangay: RawBarangay | null;
  mode: "add" | "edit";
  onSave?: (data: RawBarangay) => Promise<void>;
  openModal: (
    mode: "add" | "edit",
    barangay?: RawBarangay | null,
    onSave?: (data: RawBarangay) => Promise<void>
  ) => void;
  closeModal: () => void;
}

export const useUpdateAddBarangayModalStore = create<BarangayModalState>(
  (set) => ({
    isOpen: false,
    barangay: null,
    mode: "add",
    onSave: undefined,
    openModal: (mode, barangay = null, onSave) =>
      set({ isOpen: true, mode, barangay, onSave }),
    closeModal: () =>
      set({ isOpen: false, barangay: null, mode: "add", onSave: undefined }),
  })
);
