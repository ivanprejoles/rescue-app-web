"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientProfile } from "@/lib/client-request/client";
import { useProfileModalStore } from "@/hooks/modals/use-update-profile-modal";
import { ClientAccessResponse, ClientAccessWithBarangays } from "@/lib/types";

export const ProfileEditModal = () => {
  const { isOpen, closeModal, form, setForm } = useProfileModalStore();
  const queryClient = useQueryClient();

  // Get cached allBarangays from React Query cache
  const cachedData = queryClient.getQueryData<ClientAccessWithBarangays>([
    "client-user",
  ]);
  const barangays = cachedData?.allBarangays ?? [];

  const mutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      phone_number: string;
      brgyId: string;
    }) =>
      updateClientProfile(data.id, {
        name: data.name,
        phone_number: data.phone_number,
        brgyId: data.brgyId,
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<ClientAccessWithBarangays>(
        ["client-user"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            user: {
              ...oldData.user,
              ...updatedUser,
            },
          };
        }
      );
      closeModal();
    },
  });

  const handleSave = () => {
    if (!form.id) return;
    mutation.mutate({
      id: form.id,
      name: form.name,
      phone_number: form.phone_number,
      brgyId: form.brgyId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={form.phone_number}
              onChange={(e) => setForm({ phone_number: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="brgy">Barangay</Label>
            <Select
              value={form.brgyId}
              onValueChange={(value) => setForm({ brgyId: value })}
            >
              <SelectTrigger id="brgy" className="w-full">
                <SelectValue placeholder="Select a barangay" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {barangays.map((brgy) => (
                    <SelectItem key={brgy.id} value={brgy.id}>
                      {brgy.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={closeModal}
            className="cursor-pointer"
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
