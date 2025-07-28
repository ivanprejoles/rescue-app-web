import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
// import { LocationWithRelations } from "@/lib/types"; // define if needed

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
        queryClient.setQueryData<LocationWithRelations[]>(
          ["locations"],
          (oldData = []) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...oldData, payload.new as LocationWithRelations];
              case "UPDATE":
                return oldData.map((location) =>
                  location.id === (payload.new as LocationWithRelations).id
                    ? (payload.new as LocationWithRelations)
                    : location
                );
              case "DELETE":
                return oldData.filter(
                  (location) =>
                    location.id !== (payload.old as LocationWithRelations).id
                );
              default:
                return oldData;
            }
          }
        );
      }
    )
    .subscribe();

  // Return cleanup function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}
