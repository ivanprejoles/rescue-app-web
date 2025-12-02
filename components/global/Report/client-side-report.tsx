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
import { MarkerWithRelations, Report } from "@/lib/types";
import { useReportModalStore } from "@/hooks/modals/use-update-report";
import { useDeleteReportModalStore } from "@/hooks/modals/use-delete-report-modal";
import { Flag } from "lucide-react";
import {
  useRealtimeRegister,
  useRealtimeReportMarkers,
} from "@/lib/supabase/realtime/admin";
import { useRouter } from "next/navigation";

export default function ClientSideReport() {
  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const { data, isLoading, error } = useAdminQuery<MarkerWithRelations[]>(
    ["reports"],
    getMarkersClient
  );

  // Subscribe to realtime updates for report markers
  useRealtimeReportMarkers();
  useRealtimeRegister(router);
  const { openModal: openReport } = useReportModalStore();
  const { openModal: openDeleteReport } = useDeleteReportModalStore();

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

  const handleStatusUpdate = (report: Report) => {
    // setSelectedReport(report);
    openReport(report);
  };

  const handleDelete = (report: Report) => {
    openDeleteReport({ id: report.id, name: report.title });
  };

  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>Error loading reports.</p>;

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="Admin Reports"
        description="Manage and review citizen reports across all barangays"
        icon={Flag}
      ></SidebarHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StatisticsCards
          totalReports={totalReports}
          pendingReports={pendingReports}
          inProgressReports={inProgressReports}
          resolvedReports={resolvedReports}
        />
      </div>

      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <div className="flex flex-col gap-3">
        {filteredBarangays.map((barangay, index) => (
          <BarangaySection
            key={index}
            barangay={barangay}
            isExpanded={expandedSections.includes(barangay.id)}
            onToggle={() => toggleSection(barangay.id)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
