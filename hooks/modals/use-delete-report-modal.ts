import { create } from "zustand";

interface SimpleReport {
  id: string;
  name: string;
}

interface DeleteReportModalState {
  isOpen: boolean;
  report: SimpleReport | null;
  openModal: (report: SimpleReport) => void;
  closeModal: () => void;
  onDeleted?: () => void;
  setOnDeleted: (cb: (() => void) | undefined) => void;
}

export const useDeleteReportModalStore = create<DeleteReportModalState>(
  (set) => ({
    isOpen: false,
    report: null,
    onDeleted: undefined,
    openModal: (report) => set({ isOpen: true, report }),
    closeModal: () => set({ isOpen: false, report: null }),
    setOnDeleted: (cb) => set(() => ({ onDeleted: cb })),
  })
);
