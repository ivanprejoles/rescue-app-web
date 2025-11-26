import { create } from "zustand";

interface ProfileForm {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  brgyId: string;
}

interface ProfileModalState {
  isOpen: boolean;
  form: ProfileForm;
  openModal: (initialForm: Partial<ProfileForm>) => void;
  closeModal: () => void;
  setForm: (update: Partial<ProfileForm>) => void;
}

export const useProfileModalStore = create<ProfileModalState>((set) => ({
  isOpen: false,
  form: {
    id: "",
    name: "",
    address: "",
    phone_number: "",
    brgyId: "",
  },
  openModal: (initialForm) =>
    set({
      isOpen: true,
      form: {
        id: initialForm.id ?? "",
        name: initialForm.name ?? "",
        address: initialForm.address ?? "",
        phone_number: initialForm.phone_number ?? "",
        brgyId: initialForm.brgyId ?? "",
      },
    }),
  closeModal: () =>
    set({
      isOpen: false,
      form: {
        id: "",
        name: "",
        phone_number: "",
        address: "",
        brgyId: "",
      },
    }),
  setForm: (update) =>
    set((state) => ({
      form: { ...state.form, ...update },
    })),
}));
