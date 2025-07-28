import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEvacuationAndBarangaysForAdmin } from "@/lib/supabase/request/request-barangay-evacuation";
import { auth } from "@clerk/nextjs/server";
import ClientSideEvacuation from "@/components/global/Evacuation/client-side-evacuation";

export default async function AdminEvacuationPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const evacuations = await getEvacuationAndBarangaysForAdmin(userId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["evacuations"],
    queryFn: () => Promise.resolve(evacuations || []),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideEvacuation />
    </HydrationBoundary>
  );
}
