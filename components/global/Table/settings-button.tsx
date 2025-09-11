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
                openReportModal(data.data);
                break;
              case "natural":
                // d.data is MapMarker here
                handleMapMarker(data.data);
                break;
              case "barangay":
                handleBarangay(data.data);
                break;
              case "evacuation":
                handleEvacuationCenter(data.data);
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
            alert("wew");
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

function handleData(d: Data) {
  switch (d.type) {
    case "report":
    case "natural":
      // d.data is MapMarker here
      handleMapMarker(d.data);
      break;
    case "barangay":
      handleBarangay(d.data);
      break;
    case "evacuation":
      handleEvacuationCenter(d.data);
      break;
  }
}

export default SettingsButton;
