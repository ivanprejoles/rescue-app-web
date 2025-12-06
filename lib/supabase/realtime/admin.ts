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

            if (singleMarker) {
              const isInsert = payload.eventType === "INSERT";
              const isUpdate = payload.eventType === "UPDATE";

              // Extract people
              const user = Array.isArray(singleMarker.user)
                ? singleMarker.user[0]
                : singleMarker.user;

              const rescuer = Array.isArray(singleMarker.rescuer)
                ? singleMarker.rescuer[0]
                : singleMarker.rescuer;

              const userName = user?.name || user?.email || "a user";
              const rescuerName =
                rescuer?.name || rescuer?.email || "a rescuer";
              const status = singleMarker.status;

              const createdAt = singleMarker.created_at
                ? new Date(singleMarker.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now";

              const title = isInsert
                ? `New Report — ${createdAt}`
                : `Report Updated — ${createdAt}`;

              // Decide toast message
              let message = "";
              if (isInsert) message = `New report submitted by ${userName}`;
              if (isUpdate) {
                // 🎯 simple logic — pick the correct message based on status
                if (status === "Assigned" && rescuerName) {
                  message = `Report from ${userName} is now assigned to ${rescuerName}.`;
                } else if (status === "Resolved" && rescuerName) {
                  message = `Report from ${userName} has been resolved by ${rescuerName}.`;
                } else if (status === "Failed" && rescuerName) {
                  message = `${rescuerName} marked the report from ${userName} as failed.`;
                } else if (status === "Closed") {
                  message = `Admin has closed the report from ${userName}.`;
                } else if (rescuerName) {
                  message = `Rescuer ${rescuerName} updated a report from ${userName}.`;
                } else {
                  message = `A report from ${userName} was updated.`;
                }
              }

              // 🔔 Show toast only — no caching
              toast(title, {
                description: message,
                action: {
                  label: "Locate",
                  onClick: () => {
                    setOpen(true);
                    setActiveMarkerId(singleMarker.id);
                  },
                },
                duration: 8000,
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

                // --------------------------
                // ✅ SHOW TOAST
                // --------------------------

                const user = Array.isArray(enrichedMarker?.user)
                  ? enrichedMarker.user[0]
                  : enrichedMarker?.user;
                const rescuer = Array.isArray(enrichedMarker?.rescuer)
                  ? enrichedMarker.rescuer[0]
                  : enrichedMarker?.rescuer;

                const userName = user?.name || user?.email || "a user";
                const rescuerName =
                  rescuer?.name || rescuer?.email || "a rescuer";

                let title = "";
                let message = "";
                const createdAt = enrichedMarker.created_at
                  ? new Date(enrichedMarker.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now";

                if (payload.eventType === "INSERT") {
                  title = "New Report";
                  message = `Report submitted by ${userName}.`;
                }

                if (payload.eventType === "UPDATE") {
                  title = "Report Updated";

                  switch (enrichedMarker.status) {
                    case "Assigned":
                      message = `${userName}'s report is now assigned to ${rescuerName}.`;
                      break;

                    case "Resolved":
                      message = `${userName}'s report has been resolved by ${rescuerName}.`;
                      break;

                    case "Failed":
                      message = `${rescuerName} marked ${userName}'s report as failed.`;
                      break;

                    case "Closed":
                      message = `Admin closed the report from ${userName}.`;
                      break;

                    default:
                      message = `A report from ${userName} has been updated.`;
                  }
                }

                toast(`${title} — ${createdAt}`, {
                  description: message,
                  duration: 8000,
                });
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
              const userName = Array.isArray(user) ? user[0]?.name : user?.name;
              let message = "";

              if (payload.eventType === "INSERT") {
                message = `A new report has been created by ${userName}!`;
              } else if (payload.eventType === "UPDATE") {
                message = `A report from ${userName} has been updated!`;
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
                duration: 8000,
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

export function useRealtimeRegister(router: any) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime-users-insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "users",
        },
        (payload: any) => {
          const user = payload.new;
          if (!user) return;

          // 🔔 admin notification
          toast("New user signed up!", {
            description: `${user.email} • just now`,
            action: {
              label: "View User",
              onClick: () => router.push(`/admin/users`),
            },
            duration: 8000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useRealtimeMarker(router: any) {
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
        phone_number
      ),
      rescuer:rescuer_id (
        id,
        name,
        email,
        phone_number
      )
    `;

    const channel = supabase
      .channel("client-report-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "markers" },
        async (payload: any) => {
          try {
            // We only show toast on INSERT or UPDATE
            if (payload.eventType === "DELETE") return;

            const markerId = payload.new?.id;
            if (!markerId) return;

            // 🔍 Fetch enriched marker so we get user/rescuer
            const { data: marker, error } = await supabase
              .from("markers")
              .select(markerSelect)
              .eq("id", markerId)
              .maybeSingle();

            if (error || !marker) return;

            const isInsert = payload.eventType === "INSERT";
            const isUpdate = payload.eventType === "UPDATE";

            // Extract people
            const user = Array.isArray(marker.user)
              ? marker.user[0]
              : marker.user;

            const rescuer = Array.isArray(marker.rescuer)
              ? marker.rescuer[0]
              : marker.rescuer;

            const userName = user?.name || user?.email || "a user";
            const rescuerName = rescuer?.name || rescuer?.email || "a rescuer";
            const status = marker.status;

            const createdAt = marker.created_at
              ? new Date(marker.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now";

            const title = isInsert
              ? `New Report — ${createdAt}`
              : `Report Updated — ${createdAt}`;

            // Decide toast message
            let message = "";
            if (isInsert) message = `New report submitted by ${userName}`;
            if (isUpdate) {
              // 🎯 simple logic — pick the correct message based on status
              if (status === "Assigned" && rescuerName) {
                message = `Report from ${userName} is now assigned to ${rescuerName}.`;
              } else if (status === "Resolved" && rescuerName) {
                message = `Report from ${userName} has been resolved by ${rescuerName}.`;
              } else if (status === "Failed" && rescuerName) {
                message = `${rescuerName} marked the report from ${userName} as failed.`;
              } else if (status === "Closed") {
                message = `Admin has closed the report from ${userName}.`;
              } else if (rescuerName) {
                message = `Rescuer ${rescuerName} updated a report from ${userName}.`;
              } else {
                message = `A report from ${userName} was updated.`;
              }
            }

            // 🔔 Show toast only — no caching
            toast(title, {
              description: message,
              action: {
                label: "View Map",
                onClick: () => router.push(`/admin/map`),
              },
              duration: 8000,
            });
          } catch (err) {
            console.error("Realtime toast error:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
