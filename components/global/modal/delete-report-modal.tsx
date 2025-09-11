import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteReportModalStore } from "@/hooks/modals/use-delete-report-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteMarkerClient } from "@/lib/client-request/marker";
import { MarkerWithRelations } from "@/lib/types";

export const DeleteReportModal: React.FC = () => {
  const { isOpen, report, closeModal, onDeleted, setOnDeleted } =
    useDeleteReportModalStore();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMarkerClient(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["reports"],
        (oldReports: MarkerWithRelations[]) => {
          if (!oldReports) return [];
          return oldReports.filter((r) => r.id !== deletedId);
        }
      );
      onDeleted?.();
      closeModal();
      setOnDeleted(undefined);
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
          <DialogTitle>Delete Report</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-400">
            Are you sure you want to delete the report{" "}
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
