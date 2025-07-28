"use client";

import React, { useState} from "react";
import { Plus, Search, Filter, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnnouncementCard from "@/components/global/Announcement/announcement-card";
import AnnouncementForm from "@/components/global/Announcement/announcement-form";
import { useAdminQuery } from "@/lib/useQuery";
import { getAnnouncementsClient } from "@/lib/client-fetchers";
import { Announcement } from "@/lib/types";
import SidebarHeader from "../header";
import {
  createAnnouncementClient,
  deleteAnnouncementClient,
  updateAnnouncementClient,
} from "@/lib/client-request/announcement";
import { useQueryClient } from "@tanstack/react-query";

export default function ClientSideAnnouncement() {
  const queryClient = useQueryClient();
  const {
    data: announcements,
    isLoading,
    error,
  } = useAdminQuery(["announcements"], getAnnouncementsClient, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Initialize announcements state when data loads
  // const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  // useEffect(() => {
  //   if (data) setAnnouncements(data);
  // }, [data]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
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
    queryClient.setQueryData(["announcements"], (old = []) =>
      old.map((ann) => (ann.id === id ? { ...ann, ...updatedData } : ann))
    );

    try {
      const updatedAnnouncement = await updateAnnouncementClient(   
        id,
        updatedData
      );

      // Sync with server response just in case there are server-generated fields
      queryClient.setQueryData(["announcements"], (old = []) =>
        old.map((ann) =>
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

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    // Backup current announcements
    const previousAnnouncements = queryClient.getQueryData<Announcement[]>([
      "announcements",
    ]);

    // Optimistically remove it from cache
    queryClient.setQueryData(["announcements"], (old = []) =>
      old.filter((ann) => ann.id !== id)
    );

    try {
      await deleteAnnouncementClient(id);
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(["announcements"], previousAnnouncements);

      alert(
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete announcement"
      );
    }
  };

  // Filter announcements by search term
  const filteredAnnouncements = announcements.filter((announcement) =>
    [announcement.title, announcement.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: announcements.length,
    active: announcements.filter((a) => a.status === "active").length,
    draft: announcements.filter((a) => a.status === "draft").length,
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
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
    <div className="min-h-screen bg-white dark:bg-black">
      <SidebarHeader
        header="Announcement Management"
        description="Manage announcements"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Top Section: New Announcement Button */}
          <div className="flex justify-start">
            <Button
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Announcement
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Announcements
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All announcements in system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">
                  Currently published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft</CardTitle>
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draft}</div>
                <p className="text-xs text-muted-foreground">
                  Pending publication
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <Card>
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
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={(ann) => {
                    setEditingAnnouncement(ann);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteAnnouncement}
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
            ? handleEditAnnouncement
            : handleCreateAnnouncement
        }
        editingAnnouncement={editingAnnouncement}
      />
    </div>
  );
}
