import { useMemo } from "react";
import { BarangayReport } from "@/lib/types";

export const useReportStats = (barangays: BarangayReport[]) => {
  return useMemo(() => {
    const totalReports = barangays.reduce(
      (sum, barangay) => sum + barangay.reports.length,
      0
    );
    const pendingReports = barangays.reduce(
      (sum, barangay) =>
        sum + barangay.reports.filter((r) => r.status === "Pending").length,
      0
    );
    const inProgressReports = barangays.reduce(
      (sum, barangay) =>
        sum + barangay.reports.filter((r) => r.status === "Assigned").length,
      0
    );
    const resolvedReports = barangays.reduce(
      (sum, barangay) =>
        sum + barangay.reports.filter((r) => r.status === "Resolved").length,
      0
    );

    return {
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports,
    };
  }, [barangays]);
};
