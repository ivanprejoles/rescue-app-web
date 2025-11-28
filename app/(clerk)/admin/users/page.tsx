import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRescuersAndUsers } from "@/lib/supabase/request/request-user";
import ClientSideUser from "@/components/global/User/client-side-user";

export default async function AdminAccountPage() {
  const accounts = await getRescuersAndUsers();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["rescuers-users"],
    queryFn: () => Promise.resolve(accounts || []),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientSideUser />
    </HydrationBoundary>
  );
}
