/* eslint-disable @typescript-eslint/no-explicit-any */

import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";

export function subscribeToLocationChanges(
  supabase: SupabaseClient,
  queryClient: QueryClient
): () => void {
  const channel = supabase
    .channel("public:locations")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "locations" },
      (payload) => {
        queryClient.setQueryData<any[]>(["locations"], (oldData = []) => {
          switch (payload.eventType) {
            case "INSERT":
              return [...oldData, payload.new as any];
            case "UPDATE":
              return oldData.map((location) =>
                location.id === (payload.new as any).id
                  ? (payload.new as any)
                  : location
              );
            case "DELETE":
              return oldData.filter(
                (location) => location.id !== (payload.old as any).id
              );
            default:
              return oldData;
          }
        });
      }
    )
    .subscribe();

  // Return cleanup function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}
