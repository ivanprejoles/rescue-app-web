import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@clerk/nextjs/server";
import { getAllAnnouncements } from "@/lib/supabase/request/request-announcement";
import ClientSideAnnouncement from "@/components/global/Announcement/client-side-announcement";

export default async function AdminMapPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const announcements = await getAllAnnouncements(userId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["announcements"],
    queryFn: () => Promise.resolve(announcements || []),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideAnnouncement />
    </HydrationBoundary>
  );
}
