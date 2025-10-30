/* eslint-disable @typescript-eslint/no-explicit-any */
'"use client";';

import {
  MapPin,
  Clock,
  User,
  Activity,
  MapPinHouse,
  Settings,
} from "lucide-react";
import { ColumnConfig } from "@/lib/types";
import TooltipWrapper from "../tooltip-wrapper";
import LocateButtons from "./locate-buttons";
import SettingsButton from "./settings-button";
import { statusTextColors } from "@/lib/constants";

// Columns for MapMarkers
// MarkerWithRelations type for renders
export const defaultMarkerColumns: ColumnConfig[] = [
  {
    key: "location",
    label: "Barangay",
    icon: MapPinHouse,
    render: (marker: any) => (
      <TooltipWrapper text={marker.barangay?.name || "  Unknown  "} />
    ),
    sortable: false,
    width: "w-40",
  },
  {
    key: "placed_by",
    label: "Placed By",
    icon: User,
    render: (marker: any) => (
      <TooltipWrapper text={marker.user?.name || "  Admin  "} />
    ),
    sortable: true,
    width: "w-32",
  },
  {
    key: "description",
    label: "Description",
    icon: User,
    render: (marker: any) => (
      <TooltipWrapper text={marker.description || "   Unknown   "} />
    ),
    sortable: true,
    width: "w-32",
  },
  {
    key: "created_at",
    label: "Created",
    icon: Clock,
    render: (marker: any) =>
      marker.created_at ? (
        <TooltipWrapper
          maxLength={25}
          text={new Date(marker.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      ) : (
        "  Unknown  "
      ),
    sortable: true,
    width: "w-44",
  },
  {
    key: "status",
    label: "Status",
    icon: Activity,
    render: (marker: any) => (
      <div className="flex items-center space-x-2">
        <span
          className={`text-sm font-medium capitalize ${
            statusTextColors[
              (marker.status as keyof typeof statusTextColors) ?? "Pending"
            ] || "text-gray-700"
          }`}
        >
          {marker.status || "Unknown"}
        </span>
      </div>
    ),
    sortable: true,
    width: "w-32",
  },
  {
    key: "phone",
    label: "Phone",
    icon: MapPin,
    render: (marker: any) => (
      <div>
        <TooltipWrapper
          text={
            marker.type === "report"
              ? (marker.user?.phone_number as string)
              : "   None   "
          }
        />
      </div>
    ),
    sortable: false,
    width: "w-28",
  },
  {
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (marker: any) => <LocateButtons id={marker.id} />,
    sortable: false,
    width: "w-28",
  },
  {
    key: "actions",
    label: "Actions",
    icon: Settings,
    render: (marker: any) => (
      <SettingsButton
        address={marker.address}
        location={{ lat: marker.latitude, lng: marker.longitude }}
        number={
          marker.type === "report" ? marker.user?.phone_number : undefined
        }
        data={{
          type: marker.type === "report" ? "report" : "natural",
          data: marker,
        }}
      />
    ),
    sortable: false,
    width: "w-10",
  },
];

// Columns for MapBarangay
// MapBarangay as type for render
export const defaultBarangayColumns: ColumnConfig[] = [
  {
    key: "name",
    label: "Name",
    icon: MapPinHouse,
    render: (barangay: any) => (
      <TooltipWrapper text={barangay.name || " Unknown "} maxLength={25} />
    ),
    sortable: true,
    width: "w-56",
  },
  {
    key: "address",
    label: "Address",
    icon: MapPin,
    render: (barangay: any) => (
      <TooltipWrapper text={barangay.address || " Unknown "} maxLength={40} />
    ),
    sortable: false,
    width: "flex-1",
  },
  {
    key: "phone",
    label: "Phone",
    icon: User,
    render: (barangay: any) => barangay.phone || " Unknown ",
    sortable: false,
    width: "w-36",
  },
  {
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (barangay: any) => <LocateButtons id={barangay.id} />,
    sortable: false,
    width: "w-28",
  },
  {
    key: "actions",
    label: "Actions",
    icon: Settings,
    render: (barangay: any) => (
      <SettingsButton
        address={barangay.address as string}
        location={{
          lat: barangay.latitude as number,
          lng: barangay.longitude as number,
        }}
        number={barangay.phone || undefined}
        data={{ type: "barangay", data: barangay }}
      />
    ),
    sortable: false,
    width: "w-10",
  },
];

// Columns for MapEvacuationCenter
// MapEvacuationCenter as type for render
export const defaultEvacuationColumns: ColumnConfig[] = [
  {
    key: "name",
    label: "Name",
    icon: MapPinHouse,
    render: (evac: any) => (
      <TooltipWrapper text={evac.name || "  Unknown  "} maxLength={25} />
    ),
    sortable: true,
    width: "w-56",
  },
  {
    key: "address",
    label: "Address",
    icon: MapPin,
    render: (evac: any) => (
      <TooltipWrapper text={evac.address || "  Unknown  "} maxLength={25} />
    ),
    sortable: false,
    width: "flex-1",
  },
  {
    key: "phone",
    label: "Phone",
    icon: User,
    render: (evac: any) => evac.phone || "  Unknown  ",
    sortable: false,
    width: "w-36",
  },
  {
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (evac: any) => <LocateButtons id={evac.id} />,
    sortable: false,
    width: "w-28",
  },
  {
    key: "actions",
    label: "Actions",
    icon: Settings,
    render: (evac: any) => (
      <SettingsButton
        address={evac.address || undefined}
        location={{
          lat: evac.latitude as number,
          lng: evac.longitude as number,
        }}
        number={evac.phone || undefined}
        data={{ type: "evacuation", data: evac }}
      />
    ),
    sortable: false,
    width: "w-10",
  },
];
