import { ClientUser } from "@/lib/types";
import { create } from "zustand";

interface AssistReportModalState {
  isOpen: boolean;
  userIds: {
    rescuer: ClientUser;
    markerId: string;
  } | null;
  openModal: (userIds: { rescuer: ClientUser; markerId: string }) => void;
  closeModal: () => void;
  onDeleted?: () => void;
  setOnDeleted: (cb: (() => void) | undefined) => void;
}

export const useAssistReportModalStore = create<AssistReportModalState>(
  (set) => ({
    isOpen: false,
    userIds: null,
    onDeleted: undefined,
    openModal: (userIds) => set({ isOpen: true, userIds }),
    closeModal: () => set({ isOpen: false, userIds: null }),
    setOnDeleted: (cb) => set(() => ({ onDeleted: cb })),
  })
);
