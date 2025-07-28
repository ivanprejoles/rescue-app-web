"use client";

import { useMemo } from "react";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";
import { useAdminQuery } from "@/lib/useQuery";
import { getEvacuationCentersClient } from "@/lib/client-fetchers";
import SidebarHeader from "../header";
import { BarangayManagement } from "../Barangay/barangay-management";
import EvacuationManagement from "./evacuation-management";

const ClientSideEvacuation = () => {
  // Fetch the evacuations with only barangay IDs, and all barangays
  const { data, isLoading, error } = useAdminQuery<{
    evacuations: (RawEvacuationCenter & {
      evacuation_center_barangays: { barangay_id: string }[];
    })[];
    barangays: RawBarangay[];
  }>(["evacuations"], getEvacuationCentersClient);

  // Map evac center barangay IDs to full barangay objects
  const evacuationCenters: RawEvacuationCenter[] = useMemo(() => {
    if (!data) return [];

    const { evacuations, barangays } = data;

    // Pre-build a Map of barangay_id => barangay for fast lookup
    const barangayMap = new Map(barangays.map((b) => [b.id, b]));

    return evacuations.map((center) => {
      const barangayIds =
        center.evacuation_center_barangays?.map((rel) => rel.barangay_id) ?? [];
      const associatedBarangays = barangayIds
        .map((id) => barangayMap.get(id))
        .filter((b): b is RawBarangay => b !== undefined);

      return {
        ...center,
        barangays: associatedBarangays,
      };
    });
  }, [data]);

  if (isLoading) return <p>Loading evacuation centers...</p>;
  if (error) return <p>Error loading evacuation centers.</p>;

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <SidebarHeader
          header="Barangay Management"
          description="Manage barangays"
        ></SidebarHeader>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {data?.barangays && (
            <BarangayManagement mainBarangays={data?.barangays} />
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {evacuationCenters && (
            <EvacuationManagement evacuationCenters={evacuationCenters} allBarangays={data?.barangays} />
          )}
        </div>
      </div>
    </>
  );
};

export default ClientSideEvacuation;
