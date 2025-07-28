import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteEvacuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evacuationName: string;
  evacuationId: string;
  onDelete: (id: string) => void;
}

export function DeleteEvacuationModal({
  isOpen,
  onClose,
  evacuationName,
  evacuationId,
  onDelete,
}: DeleteEvacuationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await onDelete(evacuationId);
      onClose();
    } catch (error) {
      console.error("Error deleting barangay:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
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
