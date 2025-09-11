import { create } from "zustand";
import { Report } from "@/lib/types";

interface ReportModalState {
  isOpen: boolean;
  report: Report | null;
  openModal: (report: Report) => void;
  closeModal: () => void;
}

export const useReportModalStore = create<ReportModalState>((set) => ({
  isOpen: false,
  report: null,
  openModal: (report) => set({ isOpen: true, report }),
  closeModal: () => set({ isOpen: false, report: null }),
}));
