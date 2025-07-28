import { AlertTriangle, Waves, Droplets, Home, Mountain } from "lucide-react";
import { TypeConfig } from "./types";
import { userAgent } from "next/server";

export const insertedMarker = [
  { title: "Flood", icon: "🚣‍♀️" },
  { title: "LandSlide", icon: "⛰️" },
  { title: "StormSurge", icon: "🌊" },
  { title: "Evacuation", icon: "🏫" },
];

export const legendMarker = [
  {
    label: "Report",
    icon: "🆘",
    iconName: "flag",
    key: "report",
    color: "#e74c3c",
    iconColor: "#212121",
  },
  {
    label: "Rescuer",
    icon: "🚒",
    iconName: "truck",
    key: "rescue",
    color: "#e67e22",
    iconColor: "#212121",
  },
  {
    label: "Flood",
    icon: "🚣‍♀️",
    iconName: "tint",
    key: "flood",
    color: "#2980b9",
    iconColor: "#212121",
  },
  {
    label: "Landslide",
    icon: "⛰️",
    iconName: "mountain",
    key: "landslide",
    color: "#8e44ad",
    iconColor: "#212121",
  },
  {
    label: "Stormsurge",
    icon: "🌊",
    iconName: "water",
    key: "stormsurge",
    color: "#16a085",
    iconColor: "#212121",
  },
  {
    label: "Barangays",
    icon: "🏘️",
    iconName: "city",
    key: "barangay",
    color: "#34495e",
    iconColor: "#212121",
  },
  {
    label: "Evacuation Centers",
    icon: "🏫",
    iconName: "hospital",
    key: "evacuationCenters",
    color: "#27ae60",
    iconColor: "#212121",
  },
];

export const typeConfigs: Record<string, TypeConfig> = {
  flood: {
    // capitalized to match 'Flood' title in insertedMarker
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    textColor: "text-cyan-700",
    icon: Droplets,
    label: "Flood",
  },
  landslide: {
    color: "bg-purple-600", // example color for landslide
    lightColor: "bg-purple-100",
    borderColor: "border-purple-300",
    textColor: "text-purple-800",
    icon: Mountain,
    label: "Landslide",
  },
  stormsurge: {
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Waves,
    label: "Storm Surge",
  },
  evacuation: {
    color: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: Home,
    label: "Evacuation",
  },
  report: {
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    icon: AlertTriangle,
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
