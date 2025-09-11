"use client";

import { useMemo } from "react";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";
import { useAdminQuery } from "@/lib/useQuery";
import { getEvacuationCentersClient } from "@/lib/client-fetchers";
import SidebarHeader from "../header";
import { BarangayManagement } from "../Barangay/barangay-management";
import EvacuationManagement from "./evacuation-management";
import { Card, CardContent } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { Bell } from "lucide-react";
import { ChartRadialShape } from "../chart/barangay-radial";

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

  // WIP : update components

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading evacuations...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-4">
                <Bell className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Evacuations
              </h3>
              <p className="text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <>
      <div className="min-h-screen gap-3 mt-3 flex flex-col">
        <SidebarHeader
          header="Barangay Management"
          description="Manage barangays"
        ></SidebarHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GlowingWrapper>
            <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
              <ChartRadialShape
                label="Barangays"
                count={data?.barangays.length || 0}
                description="Total active barangays"
              />
            </Card>
          </GlowingWrapper>
          <GlowingWrapper>
            <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
              <ChartRadialShape
                label="Evacuation Centers"
                count={data?.evacuations.length || 0}
                description="Centers available in case of emergencies"
              />
            </Card>
          </GlowingWrapper>
        </div>

        <div className="w-full mx-auto">
          {data?.barangays && (
            <BarangayManagement mainBarangays={data?.barangays} />
          )}
        </div>

        <div className="w-full mx-auto">
          {evacuationCenters && (
            <EvacuationManagement
              evacuationCenters={evacuationCenters}
              allBarangays={data?.barangays}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ClientSideEvacuation;
