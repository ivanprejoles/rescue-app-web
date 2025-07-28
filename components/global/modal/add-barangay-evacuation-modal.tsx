import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Barangay {
  id: string;
  name: string;
}

interface AddUpdateBarangaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  evacuationCenterId: string;
  allBarangays?: Barangay[];
  assignedBarangayIds: Set<string>;
  onSuccess?: () => void;
}

export function AddUpdateBarangaysModal({
  isOpen,
  onClose,
  evacuationCenterId,
  allBarangays = [],
  assignedBarangayIds,
  onSuccess,
}: AddUpdateBarangaysModalProps) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    new Set(assignedBarangayIds)
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync selectedIds if assignedBarangayIds prop changes (e.g. modal reopened)
  React.useEffect(() => {
    setSelectedIds(new Set(assignedBarangayIds));
  }, [assignedBarangayIds]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const updateMutation = useMutation({
    mutationFn: async ({
      evacuationCenterId,
      toAdd,
      toRemove,
    }: {
      evacuationCenterId: string;
      toAdd: string[];
      toRemove: string[];
    }) => {
      const res = await fetch(
        `/api/admin/evacuations/${evacuationCenterId}/barangays`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toAdd, toRemove }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update barangays");
      }
      return res.json();
    },

    onMutate: async ({ evacuationCenterId, toAdd, toRemove }) => {
      await queryClient.cancelQueries({ queryKey: ["evacuations"] });

      const previous = queryClient.getQueryData(["evacuations"]);

      queryClient.setQueryData(["evacuations"], (oldData: any) => {
        if (!oldData) return oldData;

        const updated = {
          ...oldData,
          evacuations: oldData.evacuations.map((center: any) => {
            if (center.id !== evacuationCenterId) return center;

            const currentIds = new Set(
              center.evacuation_center_barangays?.map(
                (b: any) => b.barangay_id
              ) ?? []
            );

            toAdd.forEach((id) => currentIds.add(id));
            toRemove.forEach((id) => currentIds.delete(id));

            return {
              ...center,
              evacuation_center_barangays: Array.from(currentIds).map((id) => ({
                barangay_id: id,
              })),
            };
          }),
        };

        return updated;
      });

      return { previous };
    },

    onError: (err, _, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(["evacuations"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuations"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const original = assignedBarangayIds;
    const current = selectedIds;

    const toAdd = Array.from(current).filter((id) => !original.has(id));
    const toRemove = Array.from(original).filter((id) => !current.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      onClose();
      setIsLoading(false);
      return;
    }

    updateMutation.mutate(
      { evacuationCenterId, toAdd, toRemove },
      {
        onSuccess: () => {
          setIsLoading(false);
          onClose();
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          setIsLoading(false);
          setError(err.message ?? "Failed to update barangays");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Barangays in Evacuation Center</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-72 overflow-auto"
        >
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {allBarangays.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No barangays available.
            </p>
          ) : (
            allBarangays.map(({ id, name }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={`bar-${id}`}
                  checked={selectedIds.has(id)}
                  onCheckedChange={() => toggleSelect(id)}
                  disabled={isLoading}
                />
                <Label htmlFor={`bar-${id}`} className="cursor-pointer">
                  {name}
                </Label>
              </div>
            ))
          )}

          <DialogFooter className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Barangays"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
