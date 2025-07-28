import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllMarkersForMap } from "@/lib/supabase/request/request-map";
import { auth } from "@clerk/nextjs/server";
import ClientSideMap from "@/components/global/Map/client-side-map";
import { getAllLocationsForMap } from "@/lib/supabase/request/request-locations";

export default async function AdminMapPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const markers = await getAllMarkersForMap();
  const locations = await getAllLocationsForMap();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["markers"],
    queryFn: () => Promise.resolve(markers || []),
  });

  await queryClient.prefetchQuery({
    queryKey: ["locations"],
    queryFn: () => Promise.resolve(locations || []),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideMap />
    </HydrationBoundary>
  );
}
