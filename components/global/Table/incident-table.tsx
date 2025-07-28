import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TypeConfig,
  ColumnConfig,
  TableAction,
  MarkerWithRelations,
  MapMarker,
} from "@/lib/types";
import { typeConfigs } from "@/lib/constants";

interface IncidentTableProps {
  markers?: MapMarker[];
  columns: ColumnConfig[];
  actions?: TableAction[];
  showSummary?: boolean;
  groupBy?: keyof MapMarker;
  defaultCollapsed?: boolean;
}

const IncidentTable: React.FC<IncidentTableProps> = ({
  markers,
  columns,
  actions = [],
  showSummary = true,
  groupBy = "type",
  defaultCollapsed = false,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    defaultCollapsed ? new Set(Object.keys(typeConfigs)) : new Set()
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  console.log(markers);
  console.log(groupBy);

  // Group markers by groupBy field
  const groupedMarkers = useMemo(() => {
    return markers?.reduce((acc, marker) => {
      const groupKey = String(marker[groupBy as keyof MapMarker]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(marker);
      return acc;
    }, {} as Record<string, MarkerWithRelations[]>);
  }, [markers, groupBy]);

  // Sort markers within groups
  const sortedGroupedMarkers = useMemo(() => {
    if (!sortConfig) return groupedMarkers;

    const sorted: Record<string, MarkerWithRelations[]> = {};
    Object.entries(groupedMarkers!).forEach(([group, groupMarkers]) => {
      sorted[group] = [...groupMarkers].sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    });
    return sorted;
  }, [groupedMarkers, sortConfig]);

  console.log(groupedMarkers);

  const toggleGroup = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) newCollapsed.delete(groupKey);
    else newCollapsed.add(groupKey);
    setCollapsedGroups(newCollapsed);
  };

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        return current.direction === "asc"
          ? { key: columnKey, direction: "desc" }
          : null;
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const renderActionButton = (
    action: TableAction,
    incident: MarkerWithRelations,
    config: TypeConfig
  ) => {
    return (
      <Button
        key={action.label}
        variant={action.variant === "primary" ? "default" : "outline"}
        className={action.className}
        onClick={() => action.onClick(incident)}
        size="sm"
      >
        {action.label}
      </Button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Incident Management</h1>
        <p>Track and manage emergency incidents across different categories</p>
      </div>

      <div className="space-y-6">
        {Object.entries(sortedGroupedMarkers!).map(
          ([groupKey, groupMarkers]) => {
            console.log(typeConfigs);
            console.log(groupKey);
            const config = typeConfigs[groupKey];
            console.log(config);
            const Icon = config.icon;
            const isCollapsed = collapsedGroups.has(groupKey);

            return (
              <Card key={groupKey} className="overflow-hidden">
                <CardHeader
                  className={` px-6 py-4 border-b ${config.borderColor} cursor-pointer`}
                  onClick={() => toggleGroup(groupKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                        <div className={`${config.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {config.label}
                        </CardTitle>
                        <p className="text-sm">
                          {groupMarkers.length}{" "}
                          {groupMarkers.length === 1 ? "incident" : "incidents"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${config.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {groupMarkers.length}
                    </div>
                  </div>
                </CardHeader>

                {!isCollapsed && (
                  <CardContent className="overflow-x-auto p-0">
                    {/* Table Header */}
                    <div className="px-6 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        {columns.map((column) => {
                          const Icon = column.icon;
                          const isSorted = sortConfig?.key === column.key;

                          return (
                            <div
                              key={column.key}
                              className={`flex items-center space-x-1 ${
                                column.width || "flex-1"
                              } ${
                                column.sortable ? "cursor-pointer" : ""
                              }  text-sm font-medium`}
                              onClick={() => handleSort(column.key)}
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{column.label}</span>
                              {column.sortable && isSorted && (
                                <span className="text-xs">
                                  {sortConfig?.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {actions.length > 0 && (
                          <div className="w-32 text-sm font-medium">
                            Actions
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-100">
                      {groupMarkers.map((marker) => (
                        <div
                          key={marker.id}
                          className="px-6 py-4 hover:bg-muted transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            {columns.map((column) => (
                              <div
                                key={column.key}
                                className={column.width || "flex-1"}
                              >
                                {column.render(marker)}
                              </div>
                            ))}

                            {actions.length > 0 && (
                              <div className="flex items-center space-x-2 w-32">
                                {actions.map((action) =>
                                  renderActionButton(action, marker, config)
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          }
        )}
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupedMarkers &&
            Object.entries(groupedMarkers).map(([groupKey, groupIncidents]) => {
              const config = typeConfigs[groupKey] || {
                color: "bg-gray-500",
                lightColor: "bg-gray-50",
                borderColor: "border-gray-200",
                textColor: "text-gray-700",
                icon: () => null,
                label: groupKey,
              };
              const Icon = config.icon;

              return (
                <Card
                  key={groupKey}
                  className="p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm ">{config.label}</p>
                      <p className="text-2xl font-bold ">
                        {groupIncidents.length}
                      </p>
                    </div>
                    <div className={`${config.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default IncidentTable;
