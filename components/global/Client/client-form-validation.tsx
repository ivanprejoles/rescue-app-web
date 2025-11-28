/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { useFormValidation } from "@/hooks/use-form-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchemaType } from "@/hooks/use-form-validation";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { FileUploader } from "../file-uploader";
import { ShieldAlert } from "lucide-react";

export const ClientValidationForm = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const {
    isOpen,
    closeModal,
    form: initialForm,
    setForm,
  } = useFormValidation();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialForm,
    values: initialForm, // sync Zustand → RHF
  });

  const barangays =
    queryClient.getQueryData<any>(["client-user"])?.allBarangays ?? [];

  // Upload + update mutation
  const handleSave = form.handleSubmit(async (values: ProfileSchemaType) => {
    try {
      setLoading(true);
      let uploadedUrl = values.imageUrl;
      if (imageFile) {
        const fileName = `profile-${values.id}-${Date.now()}`;
        const { error } = await supabase.storage
          .from("report-storage")
          .upload(`clientPhoto/${fileName}`, imageFile);

        if (error) throw new Error("Image upload failed");

        uploadedUrl = supabase.storage
          .from("report-storage")
          .getPublicUrl(`clientPhoto/${fileName}`).data.publicUrl;
      }

      // Optionally send update to API (can be skipped if you just want invalidation)
      await fetch("/api/client/validation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, imageUrl: uploadedUrl }),
      });

      // Invalidate the client-report cache instead of mutation
      await queryClient.invalidateQueries({ queryKey: ["client-user"] });

      toast.success("Profile updated and reports refreshed successfully");
      closeModal();
      setImageFile(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600">
              <ShieldAlert size={16} className="text-white" />
            </div>
            Verify User Information
          </DialogTitle>
          <DialogDescription>
            {`This form contains the user's essential information. An admin will review and validate the account using the provided contact details before granting access to app features.`}
          </DialogDescription>
        </DialogHeader>

        {/* FORM FIELDS */}
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.watch("name")}
              onChange={(e) => setForm({ name: e.target.value })}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone Number</Label>
            <Input
              value={form.watch("phone_number")}
              onChange={(e) => setForm({ phone_number: e.target.value })}
            />
            {form.formState.errors.phone_number && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.phone_number.message}
              </p>
            )}
          </div>

          {/* ADDRESS */}
          <div>
            <Label>Address</Label>
            <Input
              value={form.watch("address")}
              onChange={(e) => setForm({ address: e.target.value })}
            />
            {form.formState.errors.address && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          {/* BARANGAY */}
          <div>
            <Label>Barangay</Label>
            <Select
              value={form.watch("brgyId")}
              onValueChange={(value) => setForm({ brgyId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a barangay" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {barangays.map((b: any) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {form.formState.errors.brgyId && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.brgyId.message}
              </p>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <Label className="text-sm font-medium text-center">
            Upload Profile Image
          </Label>
          <div className="flex flex-col gap-4 md:flex-row items-center space-y-4">
            <div className="w-full max-w-xs relative overflow-hidden">
              <FileUploader
                multiple={false}
                onChange={(files) => setImageFile(files[0])}
                removeIndex={null}
              />
            </div>

            <div className="w-[180px] h-[180px] border rounded-md overflow-hidden shadow-sm relative">
              {imageFile || form.watch("imageUrl") ? (
                <Image
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : form.watch("imageUrl") ?? ""
                  }
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
