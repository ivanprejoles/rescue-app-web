import type React from "react";
import { redirect } from "next/navigation";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { handleClientAccess } from "@/lib/supabase/request/request-client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClientAppSidebar } from "@/components/ui/client-app-sidebar";
import { MainHeader } from "@/components/ui/header";
import { QueryClient } from "@tanstack/react-query";
import ClientModalProvider from "@/components/providers/client-modal-provider";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await currentUser();
    const { sessionId } = await auth();
    const queryClient = new QueryClient();

    if (!user) {
      queryClient.clear();
      redirect("/");
    }

    const clientAccess = await handleClientAccess(user);

    if (!clientAccess.isUser) {
      // Revoke session and redirect to home/sign-in if access denied
      if (sessionId) {
        try {
          const client = await clerkClient();
          await client.sessions.revokeSession(sessionId);
        } catch (error) {
          console.error("Error revoking session:", error);
        }
      }
      redirect("/");
    }

    return (
      <>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 60)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
          defaultOpen={true}
        >
          <ClientAppSidebar variant="inset" />
          <SidebarInset className="rounded-lg overflow-auto">
            <MainHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                {children}
              </div>
            </div>
          </SidebarInset>
          {/* <div className="fixed top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
            <Spotlight />
          </div> */}
        </SidebarProvider>
        <ClientModalProvider />
      </>
    );
  } catch (error) {
    console.error("Client access error:", error);
    redirect("/");
  }
}
