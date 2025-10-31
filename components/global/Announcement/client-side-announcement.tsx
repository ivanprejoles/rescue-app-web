/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Plus, Search, Bell, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnnouncementCard from "@/components/global/Announcement/announcement-card";
import AnnouncementForm from "@/components/global/Announcement/announcement-form";
import { useAdminQuery } from "@/lib/useQuery";
import { getAnnouncementsClient } from "@/lib/client-fetchers";
import { Announcement } from "@/lib/types";
import SidebarHeader from "../header";
import {
  createAnnouncementClient,
  updateAnnouncementClient,
} from "@/lib/client-request/announcement";
import { useQueryClient } from "@tanstack/react-query";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { ChartRadar } from "../chart/announcement-chart-radar";
import { DeleteAnnouncementModal } from "../modal/delete-announcement-modal";

export default function ClientSideAnnouncement() {
  const queryClient = useQueryClient();
    const {
      data: announcements,
      isLoading,
      error,
    } = useAdminQuery<Announcement[]>(["announcements"], getAnnouncementsClient, {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] =
    useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateAnnouncement = async (
    newData: Omit<Announcement, "id">
  ) => {
    // create a temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticAnnouncement = { id: tempId, ...newData };

    // Optimistically update the cache to insert this announcement immediately
    queryClient.setQueryData(["announcements"], (old: Announcement[] = []) => [
      optimisticAnnouncement,
      ...old,
    ]);

    try {
      const createdAnnouncement = await createAnnouncementClient(newData);

      // Replace the optimistic announcement with the real one from server
      queryClient.setQueryData(["announcements"], (old: Announcement[] = []) =>
        old.map((ann) => (ann.id === tempId ? createdAnnouncement : ann))
      );

      setIsFormOpen(false);
    } catch (error) {
      // On error, rollback by removing temporary optimistic announcement
      queryClient.setQueryData(["announcements"], (old: Announcement[] = []) =>
        old.filter((ann) => ann.id !== tempId)
      );

      alert(
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to create announcement"
      );
    }
  };

  const handleEditAnnouncement = async (
    updatedData: Omit<Announcement, "id">,
    id: string
  ) => {
    const previousAnnouncements = queryClient.getQueryData<Announcement[]>([
      "announcements",
    ]);

    // Optimistically update
    queryClient.setQueryData(["announcements"], (old: any = []) =>
      old.map((ann: any) => (ann.id === id ? { ...ann, ...updatedData } : ann))
    );

    try {
      const updatedAnnouncement = await updateAnnouncementClient(
        id,
        updatedData
      );

      // Sync with server response just in case there are server-generated fields
      queryClient.setQueryData(["announcements"], (old: any = []) =>
        old.map((ann: any) =>
          ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann
        )
      );

      setEditingAnnouncement(null);
      setIsFormOpen(false);
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(["announcements"], previousAnnouncements);

      alert(
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to update announcement"
      );
    }
  };

  // Filter announcements by search term
  const filteredAnnouncements = announcements?.filter((announcement) =>
    [announcement.title, announcement.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const infoData = announcements?.filter((a) => a.status === "information");
  const warningData = announcements?.filter((a) => a.status === "warning");
  const urgentData = announcements?.filter((a) => a.status === "urgent");

  // WIP: needs to be updated
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-4">
                <Bell className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Announcements
              </h3>
              <p className="text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="Announcement Management"
        description="Manage announcements"
        icon={Megaphone}
      />

      <div className="w-full mx-auto">
        <div className="space-y-3">
          {/* Top Section: New Announcement Button */}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <GlowingWrapper>
              <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
                <ChartRadar
                  data={infoData}
                  label="Information"
                  description="General updates and awareness notices"
                />
              </Card>
            </GlowingWrapper>

            <GlowingWrapper>
              <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
                <ChartRadar
                  data={warningData}
                  label="Warning"
                  description="Alerts on potential risks and hazards"
                />
              </Card>
            </GlowingWrapper>

            <GlowingWrapper>
              <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
                <ChartRadar
                  data={urgentData}
                  label="Urgent"
                  description="Critical notices requiring immediate action"
                />
              </Card>
            </GlowingWrapper>
            {/* <ChartAreaInteractive /> */}
          </div>

          {/* Search and Filter */}

          <GlowingWrapper>
            <Card className="py-0 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-full"
                    />
                  </div>
                  <div className="flex justify-start">
                    <GradientWrapper>
                      <Button
                        onClick={() => setIsFormOpen(true)}
                        size="lg"
                        variant="outline"
                        className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        New Announcement
                      </Button>
                    </GradientWrapper>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingWrapper>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements?.length === 0 ? (
              <Card className="bg-[#2A2C40]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No announcements found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm
                      ? "Try adjusting your search criteria."
                      : "Create your first announcement to get started."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements?.map((announcement, index) => (
                <AnnouncementCard
                  key={index}
                  announcement={announcement}
                  onEdit={(ann) => {
                    setEditingAnnouncement(ann);
                    setIsFormOpen(true);
                  }}
                  onDelete={setDeletingAnnouncement}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnnouncementForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={
          editingAnnouncement
            ? handleEditAnnouncement as any
            : handleCreateAnnouncement
        }
        editingAnnouncement={editingAnnouncement}
      />
      {deletingAnnouncement && (
        <DeleteAnnouncementModal
          announcement={deletingAnnouncement}
          onClose={() => setDeletingAnnouncement(null)}
        />
      )}
    </div>
  );
}
