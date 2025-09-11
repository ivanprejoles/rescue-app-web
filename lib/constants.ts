import {
  AlertTriangle,
  Waves,
  Droplets,
  Home,
  Mountain,
  Building2,
  Hospital,
} from "lucide-react";
import { TypeConfig } from "./types";
import {
  IconMountain,
  IconAlertSmall,
  IconAmbulance,
  IconSwimming,
  IconEaseI,
  IconBuildingHospitalnOut,
  IconStorm,
  IconBuildingHospital,
  IconEaseInOut,
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
    color: "#06b6d4", // from original cyan-500: tailwind cyan-500 = #06b6d4
    iconColor: "#212121",
    svgIcon: IconSwimming,
  },
  {
    label: "Landslide",
    icon: "⛰️",
    iconName: "mountain",
    key: "landslide",
    color: "#15803d", // from original green-600: tailwind green-600 = #15803d
    iconColor: "#212121",
    svgIcon: IconMountain,
  },
  {
    label: "Stormsurge",
    icon: "🌊",
    iconName: "water",
    key: "stormsurge",
    color: "#3b82f6", // from original blue-500: tailwind blue-500 = #3b82f6
    iconColor: "#212121",
    svgIcon: IconStorm,
  },
  {
    label: "Barangays",
    icon: "🏘️",
    iconName: "city",
    key: "barangay",
    color: "#06b6d4", // from original cyan-500 = #06b6d4 instead of #34495e
    iconColor: "#212121",
    svgIcon: IconBuildingEstate,
  },
  {
    label: "Evacuation Centers",
    icon: "🏫",
    iconName: "hospital",
    key: "evacuationCenters",
    color: "#ef4444", // from original red-500 = #ef4444 instead of #27ae60
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
    // capitalized to match 'Flood' title in insertedMarker
    color: "from-cyan-500",
    dotColor: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    textColor: "text-cyan-700",
    icon: IconSwimming,
    label: "Flood",
  },
  landslide: {
    color: "from-green-600", // example color for landslide
    dotColor: "bg-green-600",
    lightColor: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-800",
    icon: Mountain,
    label: "Landslide",
  },
  stormsurge: {
    color: "from-blue-500",
    dotColor: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Waves,
    label: "Storm Surge",
  },
  evacuation: {
    color: "from-red-500",
    dotColor: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: Hospital,
    label: "Evacuation Center",
  },
  barangay: {
    color: "from-yellow-500",
    dotColor: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
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
    iconName: "truck",
    color: "#e67e22",
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

// DOCS

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

// table marker status color
export const statusTextColors: Record<
  "Pending" | "Assigned" | "Resolved" | "Failed" | "Active",
  string
> = {
  Pending: "text-yellow-500",
  Assigned: "text-blue-500",
  Resolved: "text-green-600",
  Failed: "text-red-500",
  Active: "text-red-500",
};
