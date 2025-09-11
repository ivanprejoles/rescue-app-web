import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteEvacuationModalStore } from "@/hooks/modals/use-delete-evacuation-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvacuationClient } from "@/lib/client-request/evacuation";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";

export function DeleteEvacuationModal() {
  const { isOpen, evacuationName, evacuationId, closeModal } =
    useDeleteEvacuationModalStore();

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvacuationClient(id),
    onSuccess: (_, deletedCenterId) => {
      queryClient.setQueryData(
        ["evacuations"],
        (
          oldData:
            | {
                evacuations: RawEvacuationCenter[];
                barangays: RawBarangay[];
              }
            | undefined
        ) => {
          if (!oldData) return oldData;

          const updatedEvacuations = oldData.evacuations.filter(
            (center) => center.id !== deletedCenterId
          );

          return {
            ...oldData,
            evacuations: updatedEvacuations,
            barangays: oldData.barangays, // unchanged
          };
        }
      );
      closeModal();
    },
    onError: (error) => {
      console.error("[deleteEvacuationMutation] error:", error);
      // Optional: Display error to user here
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evacuationId) return;

    setIsLoading(true);
    try {
      await deleteMutation.mutateAsync(evacuationId);
    } catch (error) {
      console.error("delete evacuation center error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete center");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>
        <p className="mb-6 text-sm">
          Are you sure you want to delete the evacuation center{" "}
          <strong>{evacuationName}</strong>? This action cannot be undone.
        </p>
        <DialogFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={closeModal}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
