export type ProfileSchemaType = z.infer<typeof profileSchema>;

import z from "zod";
import { create } from "zustand";

export const profileSchema = z.object({
  id: z.string().min(1, "Missing user ID"),
  name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(5, "Phone number too short")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  brgyId: z.string().min(1, "Please select a barangay"),
  imageUrl: z.string().nullable().optional(),
  validImageUrl: z.string().nullable().optional(),
});

interface ProfileForm {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  brgyId: string;
  imageUrl: string | null;
  validImageUrl: string | null;
}

interface ProfileModalState {
  isOpen: boolean;
  form: ProfileForm;
  openModal: (initialForm: Partial<ProfileForm>) => void;
  closeModal: () => void;
  setForm: (update: Partial<ProfileForm>) => void;
}

export const useFormValidation = create<ProfileModalState>((set) => ({
  isOpen: false,
  form: {
    id: "",
    name: "",
    address: "",
    phone_number: "",
    brgyId: "",
    validImageUrl: null,
    imageUrl: null,
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
        imageUrl: initialForm.imageUrl ?? null,
        validImageUrl: initialForm.validImageUrl ?? null,
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
        imageUrl: null,
        validImageUrl: null,
      },
    }),

  setForm: (update) =>
    set((state) => ({
      form: { ...state.form, ...update },
    })),
}));
