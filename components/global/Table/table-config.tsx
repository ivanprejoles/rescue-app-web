import {
  MapPin,
  Clock,
  User,
  Activity,
} from "lucide-react";
import {
  ColumnConfig,
  TableAction,
  MarkerWithRelations,
} from "@/lib/types";
import { typeConfigs } from "@/lib/constants";


export const defaultColumns: ColumnConfig[] = [
  {
    key: "status",
    label: "Status",
    icon: Activity,
    render: (marker: MarkerWithRelations) => (
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            typeConfigs[marker.type]?.color || "bg-gray-500"
          }`}
        ></div>
        <span className="text-sm font-medium capitalize">{marker.status}</span>
      </div>
    ),
    sortable: true,
    width: "w-32",
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    render: (marker: MarkerWithRelations) => (
      <span className="text-sm font-mono">
        {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
      </span>
    ),
    sortable: false,
    width: "w-40",
  },
  {
    key: "placed_by",
    label: "Placed By",
    icon: User,
    render: (marker: MarkerWithRelations) => (
      <span className="text-sm capitalize">{marker.address}</span>
    ),
    sortable: true,
    width: "w-28",
  },
  {
    key: "created_at",
    label: "Created",
    icon: Clock,
    render: (incident: MarkerWithRelations) => (
      <span className="text-sm">
        {new Date(incident.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
    sortable: true,
    width: "w-36",
  },
  {
    key: "id",
    label: "ID",
    render: (incident: MarkerWithRelations) => (
      <span className="text-sm font-mono">{incident.id.slice(0, 8)}...</span>
    ),
    sortable: false,
    width: "w-24",
  },
];

export const defaultActions: TableAction[] = [
  {
    label: "View",
    onClick: (incident: MarkerWithRelations) => {
      console.log("View incident:", incident.id);
      // Add your view logic here
    },
    variant: "secondary",
  },
  {
    label: "Assign",
    onClick: (incident: MarkerWithRelations) => {
      console.log("Assign incident:", incident.id);
      // Add your assign logic here
    },
    variant: "primary",
  },
];
