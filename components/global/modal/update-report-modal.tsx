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
import { MarkerWithRelations } from "@/lib/types";
import { Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { formatDate, formatReadableDate, toMilitaryTime } from "@/lib/utils";
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
      await queryClient.cancelQueries({ queryKey: ["reports"] });

      const previousReports = queryClient.getQueryData<MarkerWithRelations[]>([
        "reports",
      ]);

      queryClient.setQueryData<MarkerWithRelations[]>(
        ["reports"],
        (oldReports) => {
          if (!oldReports) return [];
          return oldReports.map((marker) =>
            marker.id === id ? { ...marker, status } : marker
          );
        }
      );

      return { previousReports };
    },
    onError: (err, variables, context) => {
      if (context?.previousReports) {
        queryClient.setQueryData(["reports"], context.previousReports);
      }
      setError("Failed to update status");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onSuccess: () => {
      closeModal();
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
    // <Dialog open={isOpen} onOpenChange={closeModal}>
    //   <DialogContent className="sm:max-w-lg">
    //     <DialogHeader>
    //       <DialogTitle>Update Status</DialogTitle>
    //     </DialogHeader>

    //     <div className="space-y-6">
    //       <div>
    //         <Select value={status} onValueChange={setStatus}>
    //           <SelectTrigger className="w-full sm:w-[140px] text-sm">
    //             <SelectValue />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectGroup>
    //               <SelectLabel>Status Options</SelectLabel>
    //               <SelectItem value="Pending">Pending</SelectItem>
    //               <SelectItem value="Assigned">Assigned</SelectItem>
    //               <SelectItem value="Resolved">Resolved</SelectItem>
    //               <SelectItem value="Failed">Failed</SelectItem>
    //             </SelectGroup>
    //           </SelectContent>
    //         </Select>
    //       </div>

    //       {error && (
    //         <p className="text-sm text-red-600 mt-2" role="alert">
    //           {error}
    //         </p>
    //       )}
    //     </div>

    //     <DialogFooter>
    //       <Button
    //         variant="outline"
    //         onClick={closeModal}
    //         disabled={updateMutation.isPending}
    //         className="cursor-pointer"
    //       >
    //         Cancel
    //       </Button>
    //       <Button
    //         onClick={handleSave}
    //         disabled={updateMutation.isPending}
    //         className="cursor-pointer"
    //       >
    //         {updateMutation.isPending ? "Saving..." : "Save"}
    //       </Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
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
          <div>
            <label className="font-semibold block">Title</label>
            <Input value={report.title} disabled />
          </div>
          <div>
            <label className="font-semibold block">Description</label>
            <Textarea
              className="border rounded p-2 w-full cursor-not-allowed resize-none"
              value={report.description}
              disabled
              rows={4}
            />
          </div>
          <div>
            <label className="font-semibold block">Contact Number</label>
            <Input value={report.contactNumber} disabled />
          </div>
          <div>
            <label className="font-semibold block">Date Reported</label>
            <Input value={formatDate(report.dateReported)} disabled />
          </div>

          <div className="space-y-2">
            <LocationPickerMap // Use the updated component
              latitude={report.latitude ? Number(report.latitude) : null}
              longitude={report.longitude ? Number(report.longitude) : null}
              onChange={(
                lat: { toString: () => string },
                lng: { toString: () => string }
              ) => {
                console.log("map disabled");
                // setFormData((prev) => ({
                //   ...prev,
                //   latitude: lat.toString(),
                //   longitude: lng.toString(),
                // }));
                // setErrors((prev) => ({
                //   ...prev,
                //   latitude: "",
                //   longitude: "",
                // }));
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="displayLatitude"
                  className="text-sm font-medium"
                >
                  Latitude
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
                  className="text-sm font-medium"
                >
                  Longitude
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

        {error && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={closeModal}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
