import { create } from "zustand";

interface DeleteEvacuationModalState {
  isOpen: boolean;
  evacuationName: string;
  evacuationId: string;
  openModal: (id: string, name: string) => void;
  closeModal: () => void;
}

export const useDeleteEvacuationModalStore = create<DeleteEvacuationModalState>(
  (set) => ({
    isOpen: false,
    evacuationName: "",
    evacuationId: "",
    openModal: (id, name) =>
      set({ isOpen: true, evacuationId: id, evacuationName: name }),
    closeModal: () =>
      set({ isOpen: false, evacuationId: "", evacuationName: "" }),
  })
);
