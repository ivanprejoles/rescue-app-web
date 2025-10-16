import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteMarkerClient } from "@/lib/client-request/marker";
import { useDeleteIncidentModalStore } from "@/hooks/modals/use-delete-map-incident-modal";
import { deleteBarangayClient } from "@/lib/client-request/barangay";
import { deleteEvacuationClient } from "@/lib/client-request/evacuation";
import { capitalizeFirstLetter } from "@/lib/utils";

export const DeleteIncidentModal: React.FC = () => {
  const { isOpen, report, closeModal } = useDeleteIncidentModalStore();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);

  const tableDeleted = async (id: string) => {
    switch (report?.type) {
      case "barangay":
        return await deleteBarangayClient(id);
      case "evacuation":
        return await deleteEvacuationClient(id);
      case "natural":
        return await deleteMarkerClient(id);
      case "report":
        return await deleteMarkerClient(id);
      default:
        throw new Error("Unknown delete type");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tableDeleted(id),
    onSuccess: () => {
      // Invalidate "markers" cache to trigger refetch and update UI
      queryClient.invalidateQueries({ queryKey: ["markers"] });
      closeModal();
    },
    onError: (error: Error) => {
      setError(error instanceof Error ? error.message : "Failed to delete");
    },
  });

  const handleDelete = async () => {
    setError(null);
    if (!report?.id) return;

    try {
      await deleteMutation.mutateAsync(report.id);
    } catch {
      // error handled in onError callback
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete {capitalizeFirstLetter(report.type)}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-400">
            Are you sure you want to delete the {report.type}{" "}
            <strong>{report.name}</strong>? This action cannot be undone.
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
            onClick={closeModal}
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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
