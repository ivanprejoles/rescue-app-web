import React from "react";
import { Ambulance, Map, MoreHorizontal, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { callNumber, openGoogleMaps } from "@/lib/utils";
import {
  ClientData,
  MapBarangay,
  MapEvacuationCenter,
  MapMarker,
} from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

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

const UserSettingsButton = ({ address, location, number, data }: Props) => {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<ClientData>(["client-report"]);

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
        {data.type === "report" &&
          cachedData?.user &&
          cachedData?.user.user_type === "rescuer" && (
            <DropdownMenuItem
              onClick={() => {}}
              className="text-green-600 focus:text-green-800"
            >
              <Ambulance className="text-green-600 focus:text-green-800" />
              Provide Assistance
            </DropdownMenuItem>
          )}
        <DropdownMenuItem onClick={() => openGoogleMaps(location, address)}>
          <Map />
          Google Map
        </DropdownMenuItem>
        {number && <ContactMenu number={number} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSettingsButton;
