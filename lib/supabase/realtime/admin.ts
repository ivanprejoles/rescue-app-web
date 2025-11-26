/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { useEffect } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../client";
import { SupabaseClient } from "@supabase/supabase-js";

export function subscribeToGlobalLocationRealtime(
  supabase: SupabaseClient,
  queryClient: QueryClient,
  userType: "user" | "rescuer" | "admin"
): () => void {
  // Same logic as the queryFn
  const targetTypes =
    userType === "admin"
      ? ["user", "rescuer"]
      : userType === "user"
      ? ["rescuer"]
      : ["user"];

  const channel = supabase
    .channel("public:locations:all")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "locations",
      },
      async (payload) => {
        const event = payload.eventType;
        const newLoc = payload.new as any;
        const oldLoc = payload.old as any;

        // Fetch user info for the modified entity
        let userInfo = null;
        if (newLoc?.entity_id || oldLoc?.entity_id) {
          const { data: user } = await supabase
            .from("users")
            .select("id, name, email, phone_number, user_type")
            .eq("id", newLoc?.entity_id ?? oldLoc?.entity_id)
            .single();

          userInfo = user || null;
        }

        // Filter out wrong user types (like query does)
        const matchesFilter = userInfo
          ? targetTypes.includes(userInfo.user_type)
          : false;

        // Update cached locations
        queryClient.setQueryData<any[]>(
          ["locations", userType],
          (oldList = []) => {
            const list = [...oldList];

            switch (event) {
              case "INSERT":
                if (!matchesFilter) return list;
                return [
                  {
                    ...newLoc,
                    userInfo,
                  },
                  ...list.filter((l) => l.id !== newLoc.id),
                ];

              case "UPDATE":
                // remove if updated to wrong type
                if (!matchesFilter)
                  return list.filter((l) => l.id !== newLoc.id);

                return list.map((l) =>
                  l.id === newLoc.id ? { ...newLoc, userInfo } : l
                );

              case "DELETE":
                return list.filter((l) => l.id !== oldLoc.id);

              default:
                return list;
            }
          }
        );
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

function applyRealtimeChangesToArray(markers: any[] = [], payload: any) {
  const type = payload.eventType; // "INSERT" | "UPDATE" | "DELETE"
  const newRow = payload.new;
  const oldRow = payload.old;

  switch (type) {
    case "INSERT": {
      // avoid duplicates: only push if not present
      if (!markers.some((m) => m.id === newRow.id)) {
        return [...markers, newRow];
      }
      return markers.map((m) => (m.id === newRow.id ? { ...m, ...newRow } : m));
    }

    case "UPDATE": {
      // replace existing or append if missing
      let found = false;
      const updated = markers.map((m) => {
        if (m.id === newRow.id) {
          found = true;
          return { ...m, ...newRow };
        }
        return m;
      });
      return found ? updated : [...updated, newRow];
    }

    case "DELETE": {
      return markers.filter((m) => m.id !== oldRow.id);
    }

    default:
      return markers;
  }
}

export function useRealtimeMap(
  setActiveMarkerId: { (id: string): void; (arg0: any): void },
  setOpen: { (val: boolean): void; (arg0: boolean): void }
) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    // create client inside effect to avoid unstable instance in deps

    // full select used in your API for a single marker
    const markerSelect = `
      id,
      type,
      description,
      latitude,
      longitude,
      imageUrl,
      status,
      created_at,
      updated_at,
      user:user_id (
        id,
        name,
        email,
        phone_number,
        status,
        brgy_id
      ),
      rescuer:rescuer_id (
        id,
        name,
        email,
        phone_number,
        status,
        brgy_id
      ),
      barangay:brgy_id (
        id,
        phone,
        name,
        address
      )
    `;

    const channel = supabase
      .channel("client-report-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "markers" },
        async (payload: any) => {
          // payload.eventType => "INSERT"|"UPDATE"|"DELETE"
          try {
            if (payload.eventType === "DELETE") {
              // Remove by id from cache
              queryClient.setQueryData(["markers"], (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  markers: applyRealtimeChangesToArray(old.markers, payload),
                };
              });
              return;
            }

            // For INSERT / UPDATE we prefer to fetch the enriched marker (with user/rescuer/barangay)
            const markerId = payload.new?.id ?? payload.old?.id;
            if (!markerId) {
              // fallback: just patch with raw payload
              queryClient.setQueryData(["markers"], (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  markers: applyRealtimeChangesToArray(old.markers, payload),
                };
              });
              return;
            }

            // fetch the single enriched marker from DB (same shape as your API)
            const { data: singleMarker, error } = await supabase
              .from("markers")
              .select(markerSelect)
              .eq("id", markerId)
              .maybeSingle();

            if (error) {
              console.error(
                "Error fetching marker for realtime update:",
                error.message
              );
              throw error;
            }

            const markerToUse = singleMarker ?? payload.new ?? payload.old;

            // update cache: insert, update, or remove depending on payload
            queryClient.setQueryData(["markers"], (old: any) => {
              if (!old) return old;
              return {
                ...old,
                markers: applyRealtimeChangesToArray(old.markers, {
                  ...payload,
                  // replace payload.new with enriched marker (for UPDATE/INSERT)
                  new:
                    payload.eventType === "DELETE" ? payload.old : markerToUse,
                }),
              };
            });

            if (payload.eventType !== "DELETE") {
              if (!singleMarker) return;
              const createdAt = singleMarker.created_at
                ? new Date(singleMarker.created_at).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                : "Unknown time";

              const user: any = singleMarker.user;
              const rescuer: any = singleMarker.rescuer;
              const userName = Array.isArray(user) ? user[0]?.name : user?.name;
              const rescuerName = Array.isArray(rescuer)
                ? rescuer[0]?.name
                : rescuer?.name;
              let message = "";

              if (payload.eventType === "INSERT") {
                message = `A new report has been created by ${userName}!`;
              } else if (payload.eventType === "UPDATE") {
                message = `A report has been updated by rescuer ${rescuerName}!`;
              }

              toast(message, {
                description: createdAt,
                action: {
                  label: "Locate",
                  onClick: () => {
                    setOpen(true);
                    setActiveMarkerId(singleMarker.id);
                  },
                },
              });
            }
          } catch (err) {
            // On error, fallback to lightweight merge using payload only
            console.error("Realtime marker handler error:", err);
            queryClient.setQueryData(["markers"], (old: any) => {
              if (!old) return old;
              return {
                ...old,
                markers: applyRealtimeChangesToArray(old.markers, payload),
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useRealtimeReportMarkers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const markerSelect = `
      id,
      type,
      description,
      latitude,
      longitude,
      imageUrl,
      status,
      created_at,
      updated_at,
      user:user_id (
        id,
        name,
        email,
        phone_number,
        user_type,
        status,
        brgy_id
      ),
      rescuer:rescuer_id (
        id,
        name,
        email,
        phone_number,
        user_type,
        status,
        brgy_id
      ),
      barangay:brgy_id (
        id,
        name
      )
    `;

    const channel = supabase
      .channel("realtime-report-markers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "markers",
          filter: `type=eq.report`,
        },
        async (payload: any) => {
          try {
            const markerId = payload.new?.id ?? payload.old?.id;
            if (!markerId) return;

            // For INSERT / UPDATE fetch the enriched marker
            let enrichedMarker: any = null;
            if (payload.eventType !== "DELETE") {
              const { data, error } = await supabase
                .from("markers")
                .select(markerSelect)
                .eq("id", markerId)
                .maybeSingle();

              if (error) {
                console.error("Error fetching enriched marker:", error.message);
                enrichedMarker = payload.new ?? payload.old;
              } else {
                enrichedMarker = data ?? payload.new ?? payload.old;
              }
            }

            // Update cache
            queryClient.setQueryData(["markers"], (old: any) => {
              if (!old) return old;

              switch (payload.eventType) {
                case "INSERT":
                  return { ...old, markers: [enrichedMarker, ...old.markers] };
                case "UPDATE":
                  return {
                    ...old,
                    markers: old.markers.map((m: any) =>
                      m.id === markerId ? enrichedMarker : m
                    ),
                  };
                case "DELETE":
                  return {
                    ...old,
                    markers: old.markers.filter((m: any) => m.id !== markerId),
                  };
                default:
                  return old;
              }
            });
          } catch (err) {
            console.error("Realtime marker handler failed:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useRealtimeRescuerMarker(
  setActiveMarkerId: { (id: string): void; (arg0: any): void },
  setOpen: { (val: boolean): void; (arg0: boolean): void }
) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    // create client inside effect to avoid unstable instance in deps

    // full select used in your API for a single marker
    const markerSelect = `
      id,
      type,
      description,
      latitude,
      longitude,
      imageUrl,
      status,
      created_at,
      updated_at,
      user:user_id (
        id,
        name,
        email,
        phone_number,
        status,
        brgy_id
      ),
      rescuer:rescuer_id (
        id,
        name,
        email,
        phone_number,
        status,
        brgy_id
      ),
      barangay:brgy_id (
        id,
        phone,
        name,
        address
      )
    `;

    const channel = supabase
      .channel("client-report-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "markers" },
        async (payload: any) => {
          // payload.eventType => "INSERT"|"UPDATE"|"DELETE"
          try {
            if (payload.eventType === "DELETE") {
              // Remove by id from cache
              queryClient.setQueryData(["client-report"], (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  markers: applyRealtimeChangesToArray(old.markers, payload),
                };
              });
              return;
            }

            // For INSERT / UPDATE we prefer to fetch the enriched marker (with user/rescuer/barangay)
            const markerId = payload.new?.id ?? payload.old?.id;
            if (!markerId) {
              // fallback: just patch with raw payload
              queryClient.setQueryData(["client-report"], (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  markers: applyRealtimeChangesToArray(old.markers, payload),
                };
              });
              return;
            }

            // fetch the single enriched marker from DB (same shape as your API)
            const { data: singleMarker, error } = await supabase
              .from("markers")
              .select(markerSelect)
              .eq("id", markerId)
              .maybeSingle();

            if (error) {
              console.error(
                "Error fetching marker for realtime update:",
                error.message
              );
              throw error;
            }

            const markerToUse = singleMarker ?? payload.new ?? payload.old;

            // update cache: insert, update, or remove depending on payload
            queryClient.setQueryData(["client-report"], (old: any) => {
              if (!old) return old;
              return {
                ...old,
                markers: applyRealtimeChangesToArray(old.markers, {
                  ...payload,
                  // replace payload.new with enriched marker (for UPDATE/INSERT)
                  new:
                    payload.eventType === "DELETE" ? payload.old : markerToUse,
                }),
              };
            });

            if (payload.eventType !== "DELETE") {
              if (!singleMarker) return;
              const createdAt = singleMarker.created_at
                ? new Date(singleMarker.created_at).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                : "Unknown time";

              const user: any = singleMarker.user;
              const rescuer: any = singleMarker.rescuer;
              const userName = Array.isArray(user) ? user[0]?.name : user?.name;
              const rescuerName = Array.isArray(rescuer)
                ? rescuer[0]?.name
                : rescuer?.name;
              let message = "";

              if (payload.eventType === "INSERT") {
                message = `A new report has been created by ${userName}!`;
              } else if (payload.eventType === "UPDATE") {
                message = `A report has been updated by rescuer ${rescuerName}!`;
              }

              toast(message, {
                description: createdAt,
                action: {
                  label: "Locate",
                  onClick: () => {
                    setOpen(true);
                    setActiveMarkerId(singleMarker.id);
                  },
                },
              });
            }
          } catch (err) {
            // On error, fallback to lightweight merge using payload only
            console.error("Realtime marker handler error:", err);
            queryClient.setQueryData(["client-report"], (old: any) => {
              if (!old) return old;
              return {
                ...old,
                markers: applyRealtimeChangesToArray(old.markers, payload),
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
