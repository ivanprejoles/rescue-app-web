import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteBarangayModalStore } from "@/hooks/modals/use-delete-barangay-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBarangayClient } from "@/lib/client-request/barangay";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";

export function DeleteBarangayModal() {
  const { isOpen, barangayName, barangayId, closeModal } =
    useDeleteBarangayModalStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBarangayClient(id),
    onSuccess: (_, deletedBarangayId) => {
      // Update cache optimistically or invalidate queries
      queryClient.setQueryData(
        ["evacuations"],
        (
          oldData:
            | {
                barangays: RawBarangay[];
                evacuations: RawEvacuationCenter[];
              }
            | undefined
        ) => {
          if (!oldData) return oldData;

          const updatedEvacuations = oldData.evacuations.map((center) => {
            const updatedJoin = center.evacuation_center_barangays?.filter(
              (rel) => rel.barangay_id !== deletedBarangayId
            );

            return {
              ...center,
              evacuation_center_barangays: updatedJoin,
            };
          });

          const updatedBarangays = oldData.barangays.filter(
            (b) => b.id !== deletedBarangayId
          );

          return {
            ...oldData,
            evacuations: updatedEvacuations,
            barangays: updatedBarangays,
          };
        }
      );

      closeModal();
    },
    onError: (error) => {
      console.error("Delete barangay failed", error);
      // Optionally show error UI
    },
  });

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barangayId) return;

    try {
      await deleteMutation.mutateAsync(barangayId);
    } catch (error) {
      console.error("Delete failed:", error);
      // Optionally show user error feedback here
    } finally {
      closeModal(); // Closes modal after successful and failed deletion
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>

        <p className="mb-6 text-sm">
          Are you sure you want to delete the barangay{" "}
          <strong>{barangayName}</strong>? This action cannot be undone.
        </p>

        <DialogFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={closeModal}
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
