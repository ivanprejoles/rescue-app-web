import React from "react";
import IncidentTable from "./incident-table";
import { ColumnConfig, MarkerWithRelations } from "@/lib/types";

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

// This is an example of how you would use the configurable table
const CustomTableExample: React.FC<{ incidents: MarkerWithRelations[] }> = ({
  incidents,
}) => {
  return (
    <IncidentTable
      markers={incidents}
      // typeConfigs={customTypeConfigs}
      columns={customColumns}
      // actions={customActions}
      // showSummary={true}
      groupBy="status" // Group by status instead of type
      defaultCollapsed={true} // Start with groups collapsed
    />
  );
};

export default CustomTableExample;
