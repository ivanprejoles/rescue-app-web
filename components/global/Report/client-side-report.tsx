"use client";

import React, { useState, useMemo } from "react";
import SidebarHeader from "@/components/global/header";
import StatisticsCards from "@/components/global/Report/statistic-card";
import FilterSection from "@/components/global/Report/filter-section";
import BarangaySection from "@/components/global/Report/barangay-section";
import { useReportFilters } from "@/hooks/use-report-filter";
import { useReportStats } from "@/hooks/use-report-stats";
import { useAdminQuery } from "@/lib/useQuery";
import { getMarkersClient } from "@/lib/client-fetchers";
import { transformMarkersToBarangayReports } from "@/lib/utils";
import { MarkerWithRelations } from "@/lib/types";

export default function ClientSideReport() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const { data, isLoading, error } = useAdminQuery<MarkerWithRelations[]>(
    ["reports"],
    getMarkersClient
  );

  const barangays = useMemo(() => {
    return data ? transformMarkersToBarangayReports(data) : [];
  }, [data]);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredBarangays,
  } = useReportFilters(barangays);

  const { totalReports, pendingReports, inProgressReports, resolvedReports } =
    useReportStats(barangays);

  const toggleSection = (barangayId: string) => {
    setExpandedSections((prev) =>
      prev.includes(barangayId)
        ? prev.filter((id) => id !== barangayId)
        : [...prev, barangayId]
    );
  };

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    console.log(`Updating report ${reportId} status to ${newStatus}`);
    // TODO: Supabase update here
  };

  const handleDelete = (reportId: string) => {
    console.log(`Deleting report ${reportId}`);
    // TODO: Supabase delete here
  };

  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>Error loading reports.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarHeader
        header="Admin Reports"
        description="Manage and review citizen reports across all barangays"
      ></SidebarHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-black flex flex-col gap-5">
        <StatisticsCards
          totalReports={totalReports}
          pendingReports={pendingReports}
          inProgressReports={inProgressReports}
          resolvedReports={resolvedReports}
        />

        <div>
          <FilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />

          <div className="flex flex-col gap-4">
            {filteredBarangays.map((barangay) => (
              <BarangaySection
                key={barangay.id}
                barangay={barangay}
                isExpanded={expandedSections.includes(barangay.id)}
                onToggle={() => toggleSection(barangay.id)}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
