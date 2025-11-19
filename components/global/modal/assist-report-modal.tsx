import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assistMarkerRescuer } from "@/lib/client-request/marker";
import { ClientData, Marker } from "@/lib/types";
import { useAssistReportModalStore } from "@/hooks/modals/use-assist-report-modal";
import { toast } from "sonner";

export const AssistReportModal: React.FC = () => {
  const { isOpen, userIds, closeModal } = useAssistReportModalStore();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const cachedData = queryClient.getQueryData<ClientData>(["client-report"]);

  const updateMutation = useMutation({
    mutationFn: ({
      rescuerId,
      markerId,
    }: {
      rescuerId: string;
      markerId: string;
    }) => assistMarkerRescuer(markerId, { rescuer_id: rescuerId }),
    onMutate: async ({ markerId }) => {
      await queryClient.cancelQueries({ queryKey: ["client-report"] });
      const previousData = queryClient.getQueryData<ClientData>([
        "client-report",
      ]);

      queryClient.setQueryData<ClientData>(["client-report"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          markers: oldData.markers.map((marker) =>
            marker.id === markerId
              ? { ...marker, rescuer: cachedData?.user }
              : marker
          ),
        };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["client-report"], context.previousData);
      }
      setError("Failed to update rescuer");
      toast.error(
        err instanceof Error ? err.message : "Failed to update rescuer"
      );
      console.error(err);
    },
    onSuccess: (updatedMarker: Marker) => {
      queryClient.setQueryData<ClientData>(["client-report"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          markers: oldData.markers.map((m) =>
            m.id === updatedMarker.id ? updatedMarker : m
          ),
        };
      });
      closeModal();
      toast.success("Rescuer assigned successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["client-report"] });
    },
  });

  const handleAssist = async () => {
    setError(null);
    if (!userIds?.rescuer.id || !userIds?.markerId) return;
    try {
      await updateMutation.mutateAsync({
        rescuerId: userIds.rescuer.id,
        markerId: userIds.markerId,
      });
    } catch {
      // error handled in onError
    }
  };

  if (!userIds?.rescuer || !userIds?.markerId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assist Report</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-400">
            Are you sure you want to assist this report? This action cannot be
            undone.
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
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssist}
            disabled={updateMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {updateMutation.isPending ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
