import { create } from "zustand";

interface DeleteBarangayModalState {
  isOpen: boolean;
  barangayName: string;
  barangayId: string;
  onDelete?: (id: string) => Promise<void>;
  openModal: (
    id: string,
    name: string,
    onDelete?: (id: string) => Promise<void>
  ) => void;
  closeModal: () => void;
}

export const useDeleteBarangayModalStore = create<DeleteBarangayModalState>(
  (set) => ({
    isOpen: false,
    barangayName: "",
    barangayId: "",
    onDelete: undefined,
    openModal: (id, name, onDelete) =>
      set({ isOpen: true, barangayId: id, barangayName: name, onDelete }),
    closeModal: () =>
      set({
        isOpen: false,
        barangayId: "",
        barangayName: "",
        onDelete: undefined,
      }),
  })
);
