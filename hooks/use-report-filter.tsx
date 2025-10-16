import { useState, useMemo } from "react";
import { BarangayReport } from "@/lib/types";

export const useReportFilters = (barangays: BarangayReport[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredBarangays = useMemo(() => {
    return barangays.map((barangay) => ({
      ...barangay,
      reports: barangay.reports.filter((report) => {
        const matchesSearch =
          searchTerm === "" ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || report.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    }));
  }, [barangays, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredBarangays,
  };
};
