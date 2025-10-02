import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getReportMarkersOnly } from "@/lib/supabase/request/request-marker";
import { auth } from "@clerk/nextjs/server";
import ClientSideReport from "@/components/global/Report/client-side-report";

export default async function AdminReportPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const reports = await getReportMarkersOnly(userId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["reports"],
    queryFn: () => Promise.resolve(reports || []),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideReport />
    </HydrationBoundary>
  );
}
