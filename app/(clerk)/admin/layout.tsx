import type React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { handleAdminAccess } from "@/lib/supabase/request/request-admin";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { MainHeader } from "@/components/ui/header";
// import { Spotlight } from "@/components/ui/spotlight-new";
import { QueryClient } from "@tanstack/react-query";
import AdminModalProvider from "@/components/providers/admin-modal-provider";

export default async function AdminLayout({
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

    const adminAccess = await handleAdminAccess(user);

    if (!adminAccess.isAdmin) {
      // Revoke Clerk session if possible
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
  } catch (error) {
    console.error("Admin access error:", error);
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
        <AppSidebar variant="inset" />
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
      <AdminModalProvider />
    </>
  );
}
