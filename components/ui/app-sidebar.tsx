"use client";

import * as React from "react";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  AlertTriangle,
  MapPin,
  Users,
  House,
  Megaphone,
  Shield,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home ",
      url: "/admin",
      icon: House,
    },
    {
      title: "Map View",
      url: "/admin/map",
      icon: MapPin,
    },
    {
      title: "Emergency Reports",
      url: "/admin/reports",
      icon: AlertTriangle,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Announcements",
      url: "/admin/announcements",
      icon: Megaphone,
    },
    {
      title: "Barangays",
      url: "/admin/barangays",
      icon: House,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Shield className="!size-5" />
                <span className="text-base font-semibold">Admin Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
