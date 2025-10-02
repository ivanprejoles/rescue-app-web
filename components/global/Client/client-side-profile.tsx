"use client";

import React from "react";
import SidebarHeader from "../header";
import { User } from "lucide-react";
import ProfileSection from "./profile-section";
import { getUserProfileClient } from "@/lib/client-fetchers";
import { useAdminQuery } from "@/lib/useQuery";
import { ClientAccessWithBarangays } from "@/lib/types";

const ClientSideProfile = () => {
  const {
    data: clientData,
    isLoading,
    error,
  } = useAdminQuery<ClientAccessWithBarangays>(
    ["client-user"],
    getUserProfileClient,
    {
      staleTime: 1000 * 60 * 60, // 1 hour cache freshness, adjust as needed
      refetchOnWindowFocus: false, // disable refetch on tab/window focus
      refetchOnMount: false, // disable refetch on mount
      refetchOnReconnect: false, // disable refetch when reconnecting
    }
  );

  if (isLoading) return <div>Loading user...</div>;
  if (error || clientData == null)
    return <div>Error loading user profile.</div>;

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="Profile"
        description="Manage user information"
        icon={User}
      ></SidebarHeader>
      <div className="h-auto flex flex-col gap-3">
        {clientData.user && <ProfileSection data={clientData.user} />}
      </div>
    </div>
  );
};

export default ClientSideProfile;
