import React from "react";
import { Shield, Zap, Building } from "lucide-react";
import IncidentTable from "./incident-table";
import {
  TypeConfig,
  ColumnConfig,
  TableAction,
  MarkerWithRelations,
} from "@/lib/types";

// Example: Custom type configurations
const customTypeConfigs: Record<string, TypeConfig> = {
  Emergency: {
    color: "bg-red-600",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: Shield,
    label: "Emergency Response",
  },
  Maintenance: {
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    icon: Zap,
    label: "Maintenance Work",
  },
  Infrastructure: {
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    icon: Building,
    label: "Infrastructure",
  },
};

// Example: Custom columns
const customColumns: ColumnConfig[] = [
  {
    key: "priority",
    label: "Priority",
    render: (incident: MarkerWithRelations) => {
      // Custom priority logic based on type
      const priority =
        incident.type === "Emergency"
          ? "High"
          : incident.type === "Maintenance"
          ? "Medium"
          : "Low";
      const colorClass =
        priority === "High"
          ? "text-red-600 bg-red-100"
          : priority === "Medium"
          ? "text-yellow-600 bg-yellow-100"
          : "text-green-600 bg-green-100";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {priority}
        </span>
      );
    },
    sortable: true,
    width: "w-24",
  },
  {
    key: "status",
    label: "Status",
    render: (incident: MarkerWithRelations) => (
      <span className="text-sm font-medium capitalize">{incident.status}</span>
    ),
    sortable: true,
    width: "w-28",
  },
  {
    key: "description",
    label: "Description",
    render: (incident: MarkerWithRelations) => (
      <span className="text-sm text-gray-600">
        {incident.description || "No description provided"}
      </span>
    ),
    width: "flex-1",
  },
];

// Example: Custom actions
const customActions: TableAction[] = [
  {
    label: "Edit",
    onClick: (incident: MarkerWithRelations) => {
      alert(`Editing incident: ${incident.id}`);
    },
    variant: "secondary",
  },
  {
    label: "Escalate",
    onClick: (incident: MarkerWithRelations) => {
      alert(`Escalating incident: ${incident.id}`);
    },
    variant: "primary",
  },
  {
    label: "Archive",
    onClick: (incident: MarkerWithRelations) => {
      alert(`Archiving incident: ${incident.id}`);
    },
    variant: "secondary",
    className: "text-red-600 hover:bg-red-50",
  },
];

// This is an example of how you would use the configurable table
const CustomTableExample: React.FC<{ incidents: MarkerWithRelations[] }> = ({
  incidents,
}) => {
  return (
    <IncidentTable
      markers={incidents}
      typeConfigs={customTypeConfigs}
      columns={customColumns}
      actions={customActions}
      showSummary={true}
      groupBy="status" // Group by status instead of type
      defaultCollapsed={true} // Start with groups collapsed
    />
  );
};

export default CustomTableExample;
