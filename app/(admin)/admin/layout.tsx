import type React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { handleAdminAccess } from "@/lib/supabase/request/request-admin";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { MainHeader } from "@/components/ui/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const { sessionId } = await auth();

  if (!user) {
    redirect("/sign-in");
  }

  let adminAccess;
  try {
    adminAccess = await handleAdminAccess(user);
  } catch (error) {
    console.error("Admin access error:", error);
    redirect("/sign-in");
  }

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

  return (
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
        {/* <div className="flex h-screen w-full overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-full">{children}</div>
            </main>
          </div>
        </div> */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
