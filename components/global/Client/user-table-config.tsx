'"use client";';

import {
  MapPin,
  Clock,
  User,
  Activity,
  MapPinHouse,
  Settings,
} from "lucide-react";
import {
  ColumnConfig,
  MarkerWithRelations,
  MapBarangay,
  MapEvacuationCenter,
} from "@/lib/types";
import TooltipWrapper from "../tooltip-wrapper";
import LocateButtons from "@/components/global/Table/locate-buttons";
import UserSettingsButton from "./user-setting-button";
import { statusTextColors } from "@/lib/constants";

// Columns for MapMarkers
export const defaultMarkerColumns: ColumnConfig[] = [
  {
    key: "location",
    label: "Barangay",
    icon: MapPinHouse,
    render: (marker: MarkerWithRelations, userBrgId) => (
      <TooltipWrapper
        text={marker.barangay?.name || "Unknown"}
        maxLength={50}
        className={marker.barangay?.id === userBrgId ? "text-yellow-400" : ""}
      />
    ),
    sortable: false,
    width: "flex-1",
  },
  {
    key: "placed_by",
    label: "Reported By",
    icon: User,
    render: (marker: MarkerWithRelations) => (
      <TooltipWrapper text={marker.user?.name || "Admin"} />
    ),
    sortable: true,
    width: "w-32",
  },
  {
    key: "created_at",
    label: "Created",
    icon: Clock,
    render: (marker: MarkerWithRelations) =>
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
        "-"
      ),
    sortable: true,
    width: "w-55",
  },
  {
    key: "status",
    label: "Status",
    icon: Activity,
    render: (marker: MarkerWithRelations) => (
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
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (marker: MarkerWithRelations) => <LocateButtons id={marker.id} />,
    sortable: false,
    width: "w-28",
  },
  {
    key: "actions",
    label: "Actions",
    icon: Settings,
    render: (marker: MarkerWithRelations) => (
      <UserSettingsButton
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
export const defaultBarangayColumns: ColumnConfig[] = [
  {
    key: "name",
    label: "Name",
    icon: MapPinHouse,
    render: (barangay: MapBarangay) => (
      <TooltipWrapper text={barangay.name || "Unknown"} maxLength={25} />
    ),
    sortable: true,
    width: "w-56",
  },
  {
    key: "address",
    label: "Address",
    icon: MapPin,
    render: (barangay: MapBarangay) => (
      <TooltipWrapper text={barangay.address || "Unknown"} maxLength={40} />
    ),
    sortable: false,
    width: "flex-1",
  },
  {
    key: "phone",
    label: "Phone",
    icon: User,
    render: (barangay: MapBarangay) => barangay.phone || "Unknown",
    sortable: false,
    width: "w-36",
  },
  {
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (marker: MarkerWithRelations) => <LocateButtons id={marker.id} />,
    sortable: false,
    width: "w-28",
  },
  // {
  //   key: "actions",
  //   label: "Actions",
  //   icon: Settings,
  //   render: (barangay: MapBarangay) => (
  //     <UserSettingsButton
  //       address={barangay.address as string}
  //       location={{
  //         lat: barangay.latitude as number,
  //         lng: barangay.longitude as number,
  //       }}
  //       number={barangay.phone || undefined}
  //       data={{ type: "barangay", data: barangay }}
  //     />
  //   ),
  //   sortable: false,
  //   width: "w-10",
  // },
];

// Columns for MapEvacuationCenter
export const defaultEvacuationColumns: ColumnConfig[] = [
  {
    key: "name",
    label: "Name",
    icon: MapPinHouse,
    render: (evac: MapEvacuationCenter, userBrgId) => {
      const selectedBrgy = evac.evacuation_center_barangays?.find(
        (b) => b.barangay_id === userBrgId
      );
      return (
        <TooltipWrapper
          text={evac.name || "Unknown"}
          maxLength={25}
          className={selectedBrgy ? "text-yellow-400" : ""}
        />
      );
    },
    sortable: true,
    width: "flex-1",
  },
  {
    key: "address",
    label: "Address",
    icon: MapPin,
    render: (evac: MapEvacuationCenter) => (
      <TooltipWrapper text={evac.address || "Unknown"} maxLength={25} />
    ),
    sortable: false,
    width: "flex-1",
  },
  {
    key: "phone",
    label: "Phone",
    icon: User,
    render: (evac: MapEvacuationCenter) => evac.phone || "-",
    sortable: false,
    width: "w-36",
  },
  {
    key: "map",
    label: "Location",
    icon: MapPin,
    render: (marker: MarkerWithRelations) => <LocateButtons id={marker.id} />,
    sortable: false,
    width: "w-28",
  },
  {
    key: "actions",
    label: "Actions",
    icon: Settings,
    render: (evac: MapEvacuationCenter) => (
      <UserSettingsButton
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
