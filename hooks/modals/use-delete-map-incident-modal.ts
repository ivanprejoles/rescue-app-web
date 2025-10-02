import { create } from "zustand";

interface Props {
  id: string;
  name: string;
  type: "report" | "natural" | "barangay" | "evacuation";
}

interface DeleteIncidentModalState {
  isOpen: boolean;
  report: Props | null;
  openModal: (report: Props) => void;
  closeModal: () => void;
}

export const useDeleteIncidentModalStore = create<DeleteIncidentModalState>(
  (set) => ({
    isOpen: false,
    report: null,
    openModal: (report) => set({ isOpen: true, report }),
    closeModal: () => set({ isOpen: false, report: null }),
  })
);
