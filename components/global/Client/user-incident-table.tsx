/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MapMarker,
  MapBarangay,
  MapEvacuationCenter,
  ColumnConfig,
  ClientUser,
} from "@/lib/types";
import { typeConfigs } from "@/lib/constants";
import { GlowingWrapper } from "@/components/ui/glowing-effect";

import {
  defaultMarkerColumns,
  defaultBarangayColumns,
  defaultEvacuationColumns,
} from "./user-table-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IncidentTableProps {
  markers?: MapMarker[];
  barangays?: MapBarangay[];
  evacuationCenters?: MapEvacuationCenter[];
  columns?: ColumnConfig[]; // optional to allow default inside component
  groupBy?: string;
  defaultCollapsed?: boolean;
  user?: ClientUser;
}

const UserIncidentTable: React.FC<IncidentTableProps> = ({
  markers,
  barangays,
  evacuationCenters,
  columns,
  groupBy = "type",
  defaultCollapsed = false,
  user = null,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    defaultCollapsed ? new Set(Object.keys(typeConfigs)) : new Set()
  );

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((cur, key) => cur?.[key], obj);
  };

  const groupByField = <T extends object>(
    items?: T[],
    forcedGroupKey?: string
  ) => {
    return items?.reduce((acc, item) => {
      const groupKey = forcedGroupKey ?? String(item[groupBy as keyof T]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  };

  const sortGrouped = <T extends object>(
    grouped: Record<string, T[]> | undefined
  ) => {
    if (!grouped || !sortConfig) return grouped;

    const sorted: Record<string, T[]> = {};
    Object.entries(grouped).forEach(([group, items]) => {
      sorted[group] = [...items].sort((a, b) => {
        const aVal = getNestedValue(a, sortConfig.key);
        const bVal = getNestedValue(b, sortConfig.key);
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    });
    return sorted;
  };

  // Group and sort data
  const groupedMarkers = useMemo(
    () => groupByField<MapMarker>(markers),
    [markers, groupBy]
  );
  const sortedGroupedMarkers = useMemo(
    () => sortGrouped(groupedMarkers),
    [groupedMarkers, sortConfig]
  );

  const groupedBarangays = useMemo(
    () => groupByField<MapBarangay>(barangays, "barangay"),
    [barangays]
  );
  const sortedGroupedBarangays = useMemo(
    () => sortGrouped(groupedBarangays),
    [groupedBarangays, sortConfig]
  );

  const groupedEvacuations = useMemo(
    () => groupByField<MapEvacuationCenter>(evacuationCenters, "evacuation"),
    [evacuationCenters]
  );
  const sortedGroupedEvacuations = useMemo(
    () => sortGrouped(groupedEvacuations),
    [groupedEvacuations, sortConfig]
  );

  const toggleGroup = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) newCollapsed.delete(groupKey);
    else newCollapsed.add(groupKey);
    setCollapsedGroups(newCollapsed);
  };

  const handleSort = (columnKey: string) => {
    setSortConfig((current) => {
      if (current?.key === columnKey) {
        return current.direction === "asc"
          ? { key: columnKey, direction: "desc" }
          : null;
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const renderGroups = <T extends object>(
    groupedData: Record<string, T[]> | undefined,
    columnsToUse: ColumnConfig[]
  ) => {
    if (!groupedData) return null;

    return Object.entries(groupedData).map(([groupKey, items]) => {
      const config = typeConfigs[groupKey] ?? {
        label: groupKey,
        icon: () => null,
        borderColor: "border-gray-700",
        color: "from-gray-500",
        dotColor: "bg-gray-700",
      };
      const Icon = config.icon;
      const isCollapsed = collapsedGroups.has(groupKey);

      const selectedMarker = items.filter(
        (item) =>
          // Check if 'barangay' exists and has 'id' matching
          ("barangay" in item &&
            (item as any).barangay?.id === user?.brgy_id) ||
          // Check if any 'evacuation_center_barangays' has 'barangay_id' matching
          ("evacuation_center_barangays" in item &&
            Array.isArray((item as any).evacuation_center_barangays) &&
            (item as any).evacuation_center_barangays.some(
              (b: { barangay_id: string }) => b.barangay_id === user?.brgy_id
            ))
      );

      return (
        <GlowingWrapper key={groupKey}>
          <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0">
            <CardHeader
              className={` px-6 py-4 ${config.borderColor} cursor-pointer`}
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
                    {Icon && (
                      <div
                        className={`bg-gradient-to-br ${config.color} to-black p-2 rounded-lg`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {config.label || groupKey}
                    </CardTitle>
                    <p className="text-sm">
                      {items.length} {items.length === 1 ? "marker" : "markers"}
                      {selectedMarker.length > 0 && (
                        <span className="text-yellow-400">{` ( ${selectedMarker.length} belongs to your barangay )`}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div
                  className={`${config.dotColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {items.length}
                </div>
              </div>
            </CardHeader>

            {!isCollapsed && (
              <CardContent className="p-0 overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      {columnsToUse.map((column, idx) => {
                        const Icon = column.icon;
                        const isSorted = sortConfig?.key === column.key;

                        return (
                          <TableHead
                            key={idx}
                            className={`whitespace-nowrap text-1xs font-medium ${
                              column.sortable
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center gap-1">
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{column.label}</span>
                              {column.sortable && isSorted && (
                                <span className="text-xs">
                                  {sortConfig?.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        {columnsToUse.map((column, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className="whitespace-nowrap text-center"
                          >
                            {column.render(item, user)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </GlowingWrapper>
      );
    });
  };

  return (
    <div className="w-full mx-auto h-auto flex flex-col gap-3">
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative px-3">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marker Management</h1>
            <p>Track and manage markers across different categories</p>
          </div>
        </Card>
      </GlowingWrapper>

      <div className="flex flex-col gap-3">
        {renderGroups(sortedGroupedMarkers, columns || defaultMarkerColumns)}
        {renderGroups(sortedGroupedBarangays, defaultBarangayColumns)}
        {renderGroups(sortedGroupedEvacuations, defaultEvacuationColumns)}
      </div>
    </div>
  );
};

export default UserIncidentTable;
