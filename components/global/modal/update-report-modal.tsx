"use client";

import React, { useState, useEffect } from "react";
import { useReportModalStore } from "@/hooks/modals/use-update-report";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMarkerClient } from "@/lib/client-request/marker"; // your update API call
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { MapData } from "@/lib/types";
import { Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false, // disables server side rendering for this component
});

export const ReportModal: React.FC = () => {
  const { isOpen, report, closeModal } = useReportModalStore();
  const [status, setStatus] = useState<string>(report?.status ?? "Pending");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setError(null);
    }
  }, [report]);

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateMarkerClient(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["markers"] });

      // snapshot previous state
      const previousData = queryClient.getQueryData<MapData>(["markers"]);

      // optimistic update
      queryClient.setQueryData<MapData>(["markers"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          markers: oldData.markers.map((marker) =>
            marker.id === id ? { ...marker, status } : marker
          ),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["markers"], context.previousData);
      }
      setError("Failed to update status");
      console.error(err);
    },

    onSuccess: (updatedMarker) => {
      queryClient.setQueryData<MapData>(["markers"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          markers: oldData.markers.map((marker) =>
            marker.id === updatedMarker.id ? updatedMarker : marker
          ),
        };
      });
      closeModal();
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["markers"],
        refetchType: "all",
      });
    },
  });

  const handleSave = async () => {
    if (!report) return;

    try {
      await updateMutation.mutateAsync({ id: report.id, status });
    } catch {
      // error already handled
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Flag size={16} className="text-white" />
            </div>
            Update Status
          </DialogTitle>
        </DialogHeader>

        {/* Readonly fields */}
        <div className="space-y-4">
          {/* Status select editable */}
          <div>
            <label className="font-semibold block mb-1">Change Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status Options</SelectLabel>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="font-semibold block text-gray-500">
              Barangay (disabled)
            </label>
            <Input value={report.barangay?.name} disabled />
          </div>
          <div>
            <label className="font-semibold block text-gray-500">
              Description (disabled)
            </label>
            <Textarea
              className="border rounded p-2 w-full cursor-not-allowed resize-none"
              value={report.description}
              disabled
              rows={4}
            />
          </div>
          <div>
            <label className="font-semibold block text-gray-500">
              Contact Number (disabled)
            </label>
            <Input value={report.user?.phone_number} disabled />
          </div>
          <div>
            <label className="font-semibold block text-gray-500">
              Date Reported (disabled)
            </label>
            <Input value={formatDate(report.created_at as string)} disabled />
          </div>

          <div className="space-y-2">
            <LocationPickerMap // Use the updated component
              latitude={report.latitude ? Number(report.latitude) : undefined}
              longitude={report.longitude ? Number(report.longitude) : undefined}
              onChange={() =>
                // lat: { toString: () => string },
                // lng: { toString: () => string }
                {}
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="displayLatitude"
                  className="text-sm font-medium text-gray-500"
                >
                  Latitude (disabled)
                </Label>
                <Input
                  id="displayLatitude"
                  value={report.latitude}
                  disabled // Make it read-only
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="displayLongitude"
                  className="text-sm font-medium text-gray-500"
                >
                  Longitude (disabled)
                </Label>
                <Input
                  id="displayLongitude"
                  value={report.longitude}
                  disabled // Make it read-only
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="flex justify-end gap-2 ">
          <Button
            variant="outline"
            onClick={closeModal}
            className="cursor-pointer"
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
