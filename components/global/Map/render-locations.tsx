"use client";

import { createClient } from "@/lib/supabase/client";
import { subscribeToLocationChanges } from "@/lib/supabase/realtime/admin";
import { MapLocation } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { CustomMarker } from "./custom-marker";
import { UserMarker } from "@/lib/constants";
import { ContactButton } from "@/components/ui/contact-button";

const RenderLocations = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch initial markers with React Query
  async function fetchLocations(): Promise<MapLocation[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  const {
    data: users,
    isLoading: userLoading,
    error: userError,
  } = useQuery<MapLocation[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5,
  });

  //   const handleMarkerClick = useCallback((report: StoredMarkerType) => {
  //     setSelectedReports((prev) => toggleReportSelection(prev, report));
  //   }, []);

  // Subscribe to realtime updates and update React Query cache
  useEffect(() => {
    const unsubscribe = subscribeToLocationChanges(supabase, queryClient);
    return () => {
      unsubscribe();
    };
  }, [queryClient, supabase]);

  if (userLoading) return null;

  return (
    users &&
    users.length > 0 &&
    users.map((user, index) => {
      if (!user.latitude || !user.longitude) return null;

      const legend = UserMarker.find((l) => l.key === user.entity_type);
      if (!legend) return null;

      return (
        <CustomMarker
          key={index}
          marker={{
            id: user.id,
            latitude: user.latitude,
            longitude: user.longitude,
            type: "barangay",
            // description: user.address || "",
          }}
          iconPicker={{
            iconName: legend.iconName,
            color: legend.color,
            iconColor: legend.iconColor,
          }}
          //   onClick={handleMarkerClick}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* <ContactButton
              icon={Phone}
              label="Phone"
              value={brgy.phone as string}
              onClick={() => callNumber(brgy.phone as string)}
              iconColor="text-blue-400"
            />
            <ContactButton
              icon={MapPin}
              label="Barangay"
              value={brgy.name as string}
              onClick={() =>
                openGoogleMaps({
                  lat: brgy.latitude as number,
                  lng: brgy.longitude as number,
                })
              }
              iconColor="text-blue-400"
            /> */}
          </div>
        </CustomMarker>
      );
    })
  );
};

export default RenderLocations;
