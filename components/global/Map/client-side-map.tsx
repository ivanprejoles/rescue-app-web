"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import IncidentTable from "../Table/incident-table";
import { MapData } from "@/lib/types";
import SidebarHeader from "../header";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import FullScreen from "./full-screen";
import { MapPinned } from "lucide-react";
import StatisticsMap from "./statistics-map";

const ReportsMap = dynamic(
  () => import("@/components/global/Map/reports-map"),
  {
    ssr: false,
  }
);

export async function fetchMarkers() {
  const res = await fetch("/api/admin/maps", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch markers");
  }
  return res.json();
}

export default function ClientSideMap() {
  // Fetch initial markers with React Query
  const { data, isLoading, error } = useQuery<MapData>({
    queryKey: ["markers"],
    queryFn: fetchMarkers,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading markers...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="Admin Map"
        description="Manage map"
        icon={MapPinned}
      ></SidebarHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StatisticsMap
          hazards={data?.markers.filter((m) => m.type !== "report").length || 0}
          reports={data?.markers.filter((m) => m.type === "report").length || 0}
          barangays={data?.barangays.length || 0}
          centers={data?.evacuationCenters.length || 0}
        />
      </div>
      <div className="h-auto flex flex-col gap-3">
        <GlowingWrapper>
          <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
            <CardHeader>
              <div className="flex items-center justify-between h-auto">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Emergency Reports Map
                  </CardTitle>
                  <CardDescription>
                    Real-time geographic view of emergency reports (
                    {data?.markers.length} visible)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <FullScreen data={data} />
                  {/* <GradientWrapper>
                    <Button
                      size="lg"
                      variant="outline"
                      className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                  </GradientWrapper> */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[600px]">
                <ReportsMap
                  reports={data}
                  // onReportClick={handleReportClick}
                />
              </div>
            </CardContent>
          </Card>
        </GlowingWrapper>
        <IncidentTable
          markers={data?.markers}
          barangays={data?.barangays}
          evacuationCenters={data?.evacuationCenters}
          // columns={defaultColumns}
          // actions={defaultActions}
          // showSummary={true}
          groupBy="type"
          defaultCollapsed={false}
        />
      </div>
    </div>
  );
}
