/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Announcement {
  id: string;
  // add other fields as needed
}

interface DeleteAnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  onDeleted?: () => void; // callback after successful delete
}

export const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({
  announcement,
  onClose,
  onDeleted,
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (announcement) {
      setOpen(true);
      setError(null);
    } else {
      setOpen(false);
      setError(null);
    }
  }, [announcement]);

  // ✅ Mutation for deleting announcement
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete announcement");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] }); // Refetch announcements
      onDeleted?.();
      setOpen(false);
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || "Something went wrong");
    },
  });

  if (!announcement) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Announcement</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-400">
            Are you sure you want to delete this announcement? This action
            cannot be undone.
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => announcement && deleteMutation.mutate(announcement.id)}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
