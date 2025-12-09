import { Waves, Mountain, Building2, Hospital } from "lucide-react";
import { TypeConfig } from "./types";
import {
  IconMountain,
  IconSwimming,
  IconStorm,
  IconBuildingHospital,
  IconBuildingEstate,
  IconFlag,
  IconFlagFilled,
} from "@tabler/icons-react";

export const insertedMarker = [
  { title: "Flood", icon: "🚣‍♀️", svgIcon: IconSwimming },
  { title: "LandSlide", icon: "⛰️", svgIcon: IconMountain },
  { title: "StormSurge", icon: "🌊", svgIcon: IconStorm },
  { title: "Evacuation", icon: "🏫", svgIcon: IconBuildingHospital },
];

export const legendMarker = [
  {
    label: "Flood",
    icon: "🚣‍♀️",
    iconName: "swimmer",
    key: "flood",
    color: "#ef4444",
    iconColor: "#212121",
    svgIcon: IconSwimming,
  },
  {
    label: "Landslide",
    icon: "⛰️",
    iconName: "mountain",
    key: "landslide",
    color: "#ef4444",
    iconColor: "#212121",
    svgIcon: IconMountain,
  },
  {
    label: "Stormsurge",
    icon: "🌊",
    iconName: "water",
    key: "stormsurge",
    color: "#ef4444",
    iconColor: "#212121",
    svgIcon: IconStorm,
  },
  {
    label: "Barangays",
    icon: "🏘️",
    iconName: "city",
    key: "barangay",
    color: "#3b82f6",
    iconColor: "#212121",
    svgIcon: IconBuildingEstate,
  },
  {
    label: "Evacuation Centers",
    icon: "🏫",
    iconName: "hospital",
    key: "evacuationCenters",
    color: "#15803d",
    iconColor: "#212121",
    svgIcon: IconBuildingHospital,
  },
  {
    label: "Report",
    icon: "🆘",
    iconName: "flag",
    key: "report",
    color: "#f97316",
    iconColor: "#212121",
    svgIcon: IconFlag,
  },
];

export const typeConfigs: Record<string, TypeConfig> = {
  flood: {
    color: "from-red-500",
    dotColor: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: IconSwimming,
    label: "Flood",
  },
  landslide: {
    color: "from-red-500",
    dotColor: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: Mountain,
    label: "Landslide",
  },
  stormsurge: {
    color: "from-red-500",
    dotColor: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: Waves,
    label: "Storm Surge",
  },
  evacuation: {
    color: "from-green-500",
    dotColor: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    icon: Hospital,
    label: "Evacuation Center",
  },
  barangay: {
    color: "from-blue-500",
    dotColor: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Building2,
    label: "Barangay",
  },
  report: {
    color: "from-orange-500",
    dotColor: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    icon: IconFlagFilled,
    label: "Report",
  },
};

export const UserMarker = [
  {
    key: "user",
    label: "User",
    iconName: "user",
    color: "#7ae622",
    iconColor: "#212121",
  },
  {
    key: "rescuer",
    label: "Rescuer",
    iconName: "truck",
    color: "#e67e22",
    iconColor: "#212121",
  },
];

// rotating card slider
export const rotatingSliderCard = [
  {
    title: "Flood",
    description: "Floods damage homes and infrastructure.",
    image: "/images/rotating-slider/flood.png",
  },
  {
    title: "Landslide",
    description: "Landslides cause debris flow after heavy rain.",
    image: "/images/rotating-slider/landslide.png",
  },
  {
    title: "Storm Surge",
    description: "Storm surges flood and erode coasts.",
    image: "/images/rotating-slider/stormsurge.png",
  },
  {
    title: "Evacuation Centers",
    description: "Centers provide shelter during disasters.",
    image: "/images/rotating-slider/center.png",
  },
  {
    title: "Rescuer",
    description: "Trained teams rescue and evacuate victims.",
    image: "/images/rotating-slider/rescuer.png",
  },
];

export const statusTextColors: Record<
  "Pending" | "Assigned" | "Resolved" | "Unresolved" | "Active" | "Closed",
  string
> = {
  Pending: "text-yellow-500",
  Assigned: "text-blue-500",
  Resolved: "text-green-600",
  Unresolved: "text-red-500",
  Active: "text-red-500",
  Closed: "text-gray-500",
};

export const statusMarkerColor = {
  Pending: "#EAB308",
  Assigned: "#3B82F6",
  Resolved: "#16A34A",
  Unresolved: "#EF4444",
  Closed: "#808080",
};
