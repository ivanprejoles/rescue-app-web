import ClientSideProfile from "@/components/global/Client/client-side-profile";
import { getClientProfile } from "@/lib/supabase/request/request-client";
import { auth } from "@clerk/nextjs/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const profile = await getClientProfile(userId);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["client-user"],
    queryFn: () => Promise.resolve(profile),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideProfile />
    </HydrationBoundary>
  );
}
