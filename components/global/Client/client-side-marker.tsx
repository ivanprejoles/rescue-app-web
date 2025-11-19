"use client";

import React, { useCallback } from "react";
import SidebarHeader from "../header";
import { MapPinned } from "lucide-react";
import { getUserMarkersClient } from "@/lib/client-fetchers";
import { useAdminQuery } from "@/lib/useQuery";
import { ClientData } from "@/lib/types";
import UserSection from "./user-section";
import RescuerSection from "./rescuer-section";
import StatisticsMap from "../Map/statistics-map";
import { useRealtimeRescuerMarker } from "@/lib/supabase/realtime/admin";
import { useMapStore } from "@/hooks/useMapStore";
import { useDialogStore } from "@/hooks/use-full-screen";

const ClientSideMarkerUser = () => {
  const {
    data: clientData,
    isLoading,
    error,
  } = useAdminQuery<ClientData>(["client-report"], getUserMarkersClient, {
    staleTime: 1000 * 60 * 60, // data considered fresh for 1 hour
    refetchOnWindowFocus: true, // refresh when switching back to tab
    refetchOnMount: "always", // refresh when navigating back to this page
    refetchOnReconnect: true, // refresh when internet reconnects
    refetchInterval: 1000 * 60 * 3, // refresh every 3 minutes
  });

  if (isLoading) return <div>Loading markers...</div>;
  if (error || clientData == null) return <div>Error loading markers.</div>;

  const filteredMarkers = clientData.markers.filter(
    (marker) =>
      !(marker.type === "report" && marker.user?.id !== clientData.user.id)
  );

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="User Report"
        description="Manage user reports"
        icon={MapPinned}
      ></SidebarHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatisticsMap
          hazards={
            clientData.markers.filter((m) => m.type !== "report").length || 0
          }
          reports={
            filteredMarkers.filter((m) => m.type === "report").length || 0
          }
          barangays={undefined}
          centers={clientData.evacuationCenters.length || 0}
        />
      </div>
      <div className="h-auto flex flex-col gap-3">
        {clientData.user && (
          <UserSection
            markers={filteredMarkers}
            evacuationCenters={clientData.evacuationCenters}
            user={clientData.user}
          />
        )}
      </div>
    </div>
  );
};

const ClientSideMarkerRescuer = () => {
  const { setActiveMarkerId } = useMapStore();
  const { setOpen } = useDialogStore();
  const handleSetMarkerId = useCallback(
    (id: string) => {
      setActiveMarkerId(id);
    },
    [setActiveMarkerId]
  );

  const handleSetOpen = useCallback(
    (val: boolean) => {
      setOpen(val);
    },
    [setOpen]
  );

  const {
    data: clientData,
    isLoading,
    error,
  } = useAdminQuery<ClientData>(["client-report"], getUserMarkersClient, {
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useRealtimeRescuerMarker(handleSetMarkerId, handleSetOpen);
  if (isLoading) return <div>Loading markers...</div>;
  if (error || clientData == null) return <div>Error loading markers.</div>;

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="Rescuer Report"
        description="Manage rescuer reports"
        icon={MapPinned}
      ></SidebarHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatisticsMap
          hazards={
            clientData.markers.filter((m) => m.type !== "report").length || 0
          }
          reports={
            clientData.markers.filter((m) => m.type === "report").length || 0
          }
          barangays={undefined}
          centers={clientData.evacuationCenters.length || 0}
        />
      </div>
      <div className="h-auto flex flex-col gap-3">
        {clientData.user && (
          <RescuerSection
            markers={clientData.markers}
            evacuationCenters={clientData.evacuationCenters}
            user={clientData.user}
          />
        )}
      </div>
    </div>
  );
};

export { ClientSideMarkerRescuer, ClientSideMarkerUser };
