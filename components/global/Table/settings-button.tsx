/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Map, MoreHorizontal, Pencil, Phone, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { callNumber, openGoogleMaps } from "@/lib/utils";
import { MapBarangay, MapEvacuationCenter, MapMarker } from "@/lib/types";
import { useReportModalStore } from "@/hooks/modals/use-update-report";
import { useUpdateAddMapModal } from "@/hooks/modals/use-update-add-map-modal";
import { useUpdateAddBarangayModalStore } from "@/hooks/modals/use-update-add-barangay-modal";
import { useDeleteIncidentModalStore } from "@/hooks/modals/use-delete-map-incident-modal";

type Props = {
  address?: string;
  location?: { lat: number; lng: number };
  number?: string;
  data: {
    type: "report" | "natural" | "barangay" | "evacuation";
    data: MapMarker | MapBarangay | MapEvacuationCenter;
  };
};

const ContactMenu = ({ number }: { number: string }) => {
  return (
    <DropdownMenuItem onClick={() => callNumber(number)}>
      <Phone />
      Call
    </DropdownMenuItem>
  );
};

const SettingsButton = ({ address, location, number, data }: Props) => {
  const { openModal: openReportModal } = useReportModalStore();
  const { openModal: openUpdateMapModal } = useUpdateAddMapModal();
  const { openModal: openUpdateBarangayModal } =
    useUpdateAddBarangayModalStore();

  // DELETE
  const { openModal: openDeleteIncidentModal } = useDeleteIncidentModalStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => openGoogleMaps(location, address)}>
          <Map />
          Google Map
        </DropdownMenuItem>
        {number && <ContactMenu number={number} />}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            switch (data.type) {
              case "report":
                openReportModal(data.data as any);
                break;
              case "natural":
                // d.data is MapMarker here
                openUpdateMapModal("marker" as never, data.data as any);
                break;
              case "barangay":
                openUpdateBarangayModal("edit", data.data as any);
                break;
              case "evacuation":
                openUpdateMapModal("evacuation" as never, data.data as any);
                break;
            }
          }}
          className="text-red-500 hover:text-red-600"
        >
          <Pencil className="text-red-500 hover:text-red-600" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            switch (data.type) {
              case "report":
                const report: MapMarker = data.data as MapMarker;
                openDeleteIncidentModal({
                  id: data.data.id,
                  type: data.type,
                  name: report.type,
                });
                break;
              case "natural":
                const natural: MapMarker = data.data as MapMarker;
                openDeleteIncidentModal({
                  id: data.data.id,
                  type: data.type,
                  name: natural.type,
                });
                break;
              case "barangay":
                const barangay: MapBarangay = data.data as MapBarangay;
                openDeleteIncidentModal({
                  id: data.data.id,
                  type: data.type,
                  name: barangay.name,
                });
                break;
              case "evacuation":
                const evacuation: MapEvacuationCenter =
                  data.data as MapEvacuationCenter;
                openDeleteIncidentModal({
                  id: data.data.id,
                  type: data.type,
                  name: evacuation.name,
                });
                break;
            }
          }}
          className="text-red-500 hover:text-red-600"
        >
          <Trash className="text-red-500 hover:text-red-600" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsButton;
