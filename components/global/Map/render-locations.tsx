"use client";

import { createClient } from "@/lib/supabase/client";
import { subscribeToLocationChanges } from "@/lib/supabase/realtime/admin";
import { MapLocation } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CustomMarker } from "./custom-marker";
import { UserMarker } from "@/lib/constants";
import { ContactButton } from "@/components/ui/contact-button";
import { MapPin, Phone } from "lucide-react";
import { callNumber, openGoogleMaps } from "@/lib/utils";

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
    isLoading,
    isError,
    error,
  } = useQuery<MapLocation[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    const unsubscribe = subscribeToLocationChanges(supabase, queryClient);
    return () => {
      unsubscribe();
    };
  }, [queryClient, supabase]);

  // Show loading UI
  if (isLoading) {
    return <p className="text-center text-gray-400">Loading locations...</p>;
  }

  // Show error UI with message
  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error loading locations: {(error as Error)?.message || "Unknown error"}
      </p>
    );
  }

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
          }}
          iconPicker={{
            iconName: legend.iconName,
            color: legend.color,
            iconColor: legend.iconColor,
          }}
        >
          <h1 className="w-full text-center mb-2 text-lg font-bold">
            {`Rescuer ${user.name}`}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactButton
              icon={Phone}
              label="Phone"
              value={user.phone_number}
              onClick={() => callNumber(user.phone_number as string)}
              iconColor="text-blue-400"
            />
            <ContactButton
              icon={MapPin}
              label="Rescuer"
              value={user.name}
              onClick={() =>
                openGoogleMaps({
                  lat: user.latitude as number,
                  lng: user.longitude as number,
                })
              }
              iconColor="text-blue-400"
            />
          </div>
        </CustomMarker>
      );
    })
  );
};

export default RenderLocations;
