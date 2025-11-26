"use client";

import { createClient } from "@/lib/supabase/client";
import { subscribeToGlobalLocationRealtime } from "@/lib/supabase/realtime/admin";
import { MapLocation } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CustomMarker } from "./custom-marker";
import { UserMarker } from "@/lib/constants";
import { ContactButton } from "@/components/ui/contact-button";
import { LoaderIcon, Mail, Phone } from "lucide-react";
import { callNumber, openGmailComposeWithRecipient } from "@/lib/utils";

interface Props {
  userType?: "rescuer" | "user" | "admin";
}

const RenderLocations = ({ userType = "user" }: Props) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Determine the target(s) to display
  const targetTypes =
    userType === "admin"
      ? ["user", "rescuer"] // admin shows ALL
      : userType === "user"
      ? ["rescuer"] // users only see rescuers
      : ["user"]; // rescuers only see users

  const { data: locations, isPending } = useQuery<
    (MapLocation & {
      userInfo?: {
        id: string;
        name: string;
        email?: string;
        phone_number?: string;
        user_type?: string;
      };
    })[]
  >({
    queryKey: ["locations", userType],
    queryFn: async () => {
      // 1. Fetch all locations
      const { data: locationsData, error: locError } = await supabase
        .from("locations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (locError) throw locError;

      if (!locationsData?.length) return [];

      // 2. Get unique ids
      const entityIds = Array.from(
        new Set(locationsData.map((l) => l.entity_id))
      );

      console.log(entityIds);
      // 3. Fetch user info filtered by targetTypes
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, name, email, phone_number, user_type")
        .in("id", entityIds)
        .in("user_type", targetTypes);

      if (usersError) console.error(usersError);

      console.log(usersData);

      // 4. Attach user info to each location
      return locationsData
        .map((loc) => ({
          ...loc,
          userInfo: usersData?.find((u) => u.id === loc.entity_id),
        }))
        .filter((loc) => loc.userInfo); // keep only matching types
    },
    enabled: true,
  });

  // Subscribe to realtime updates for this user
  useEffect(() => {
    if (!userType) return;

    const unsubscribe = subscribeToGlobalLocationRealtime(
      supabase,
      queryClient,
      userType
    );

    return () => {
      unsubscribe();
    };
  }, [userType, supabase, queryClient]);

  if (isPending) return <LoaderIcon className="h-6 w-6 animate-spin mb-2" />;

  const validLocations = (locations || []).filter(
    (loc) => loc.latitude && loc.longitude && loc.userInfo
  );

  // Show loading UI
  if (isPending) return <LoaderIcon className="h-6 w-6 animate-spin mb-2" />;
  console.log("render location");
  console.log(validLocations);
  console.log(targetTypes);

  return (
    <>
      {validLocations.map((loc) => {
        const legend = UserMarker.find((l) => l.key === loc.entity_type)!;

        console.log(loc);
        return (
          <CustomMarker
            key={loc.id}
            marker={{
              id: loc.id,
              latitude: loc.latitude,
              longitude: loc.longitude,
              type: "barangay",
            }}
            iconPicker={{
              iconName: legend.iconName,
              color: legend.color,
              iconColor: legend.iconColor,
            }}
          >
            <h1 className="w-full text-center mb-2 text-lg font-bold">
              {loc.userInfo &&
                loc.userInfo.name &&
                `${loc.entity_type == "rescuer" ? "Rescuer" : "User"} ${
                  loc.userInfo.name
                }`}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loc.userInfo && loc.userInfo.phone_number && (
                <ContactButton
                  icon={Phone}
                  label="Phone"
                  value={loc.userInfo.phone_number}
                  onClick={() =>
                    callNumber(loc.userInfo?.phone_number as string)
                  }
                  iconColor={
                    loc.entity_type == "rescuer"
                      ? "text-red-400"
                      : "text-blue-400"
                  }
                />
              )}
              {loc.userInfo && loc.userInfo.email && (
                <ContactButton
                  icon={Mail}
                  label="Email"
                  value={loc.userInfo.email}
                  onClick={() =>
                    openGmailComposeWithRecipient(loc.userInfo?.email as string)
                  }
                  iconColor={
                    loc.entity_type == "rescuer"
                      ? "text-red-400"
                      : "text-blue-400"
                  }
                />
              )}
            </div>
          </CustomMarker>
        );
      })}
    </>
  );
};

export default RenderLocations;
