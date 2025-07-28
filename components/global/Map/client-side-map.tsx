"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import IncidentTable from "../Table/incident-table";
import { defaultActions, defaultColumns } from "../Table/table-config";
import { MapData } from "@/lib/types";
import SidebarHeader from "../header";

const ReportsMap = dynamic(
  () => import("@/components/global/Map/reports-map"),
  {
    ssr: false,
  }
);

async function fetchMarkers() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarHeader
        header="Admin Map"
        description="Manage map"
      ></SidebarHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-black flex flex-col gap-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Emergency Reports Map
                </CardTitle>
                <CardDescription>
                  Real-time geographic view of emergency reports (
                  {data?.markers.length} visible)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Screen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <ReportsMap
                reports={data}
                // onReportClick={handleReportClick}
              />
            </div>
          </CardContent>
        </Card>
        <IncidentTable
          markers={data?.markers}
          columns={defaultColumns}
          actions={defaultActions}
          showSummary={true}
          groupBy="type"
          defaultCollapsed={false}
        />
      </div>
    </div>
  );
}
