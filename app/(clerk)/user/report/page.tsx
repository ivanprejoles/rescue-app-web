import {
  ClientSideMarkerRescuer,
  ClientSideMarkerUser,
} from "@/components/global/Client/client-side-marker";
import { getClientReport } from "@/lib/supabase/request/request-client";
import { ClientData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

export default async function ReportPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Instantiate React Query client
  const queryClient = new QueryClient();

  // Prefetch the client report data (which includes user info, like user_type)
  const reports = await getClientReport(userId);

  await queryClient.prefetchQuery({
    queryKey: ["client-report"],
    queryFn: () => Promise.resolve(reports),
  });

  const cachedData = queryClient.getQueryData<ClientData>(["client-report"]);

  // Extract user_type safely with type guards
  const userType =
    cachedData && cachedData.user ? cachedData.user.user_type : undefined;

  if (!userType) {
    // handle case where user_type isn't present (optional)
    redirect("/user");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Example conditional rendering based on user_type */}
      {userType === "rescuer" ? (
      <ClientSideMarkerRescuer />
      ) : (
        <ClientSideMarkerUser />
      )}
    </HydrationBoundary>
  );
}
