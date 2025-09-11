import {create} from "zustand";

type DialogState = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  setOpen: (value: boolean) => set({ open: value }),
}));
