import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllAnnouncements } from "@/lib/supabase/request/request-announcement";
import ClientSideAnnouncement from "@/components/global/Announcement/client-side-announcement";

export default async function AdminMapPage() {
  const announcements = await getAllAnnouncements();

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
