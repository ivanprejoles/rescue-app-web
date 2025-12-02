"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UserList } from "@/components/global/User/user-list";
import { UserModal } from "@/components/global/modal/user-modal";
import { RescuerList } from "@/components/global/Rescuer/rescuer-list";
import { UserFilters } from "@/components/global/User/user-filter";
import { RescuerFilters } from "@/components/global/Rescuer/rescuer-filter";
import type { User } from "@/lib/types";
import { useAdminQuery } from "@/lib/useQuery";
import { getRescuersAndUsersClient } from "@/lib/client-fetchers";
import SidebarHeader from "../header";
import { AlertTriangle, Users } from "lucide-react";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { ChartRadialStack } from "../chart/user-radial-stack";
import { UnverifiedFilters } from "../Unverified/unverified-filter";
import { UnverifiedList } from "../Unverified/unverified-list";
import {
  useRealtimeMarker,
  useRealtimeRegister,
} from "@/lib/supabase/realtime/admin";
import { useRouter } from "next/navigation";

// Loading skeleton component
const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {[...Array(2)].map((_, i) => (
      <GlowingWrapper key={i}>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
        </Card>
      </GlowingWrapper>
    ))}
  </div>
);

const LoadingList = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <GlowingWrapper key={i}>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>
      </GlowingWrapper>
    ))}
  </div>
);

export default function ClientSideUser() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [rescuerSearch, setRescuerSearch] = useState("");
  const [unverifiedSearch, setUnverifiedSearch] = useState("");

  const { data, isLoading, error } = useAdminQuery<{
    users: User[];
    rescuers: User[];
    unverifieds: User[];
  }>(["rescuers-users"], getRescuersAndUsersClient);
  useRealtimeRegister(router);
  useRealtimeMarker(router);
  // Filter users
  const filteredUsers = useMemo(() => {
    const users = data?.users ?? [];
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase());

      return matchesSearch;
    });
  }, [userSearch, data]);

  // Filter rescuers
  const filteredRescuers = useMemo(() => {
    const rescuers = data?.rescuers ?? [];
    return rescuers.filter((rescuer) => {
      const matchesSearch =
        rescuer.name.toLowerCase().includes(rescuerSearch.toLowerCase()) ||
        rescuer.email.toLowerCase().includes(rescuerSearch.toLowerCase());

      return matchesSearch;
    });
  }, [rescuerSearch, data]);

  // Filter unverifieds
  const filteredUnverifieds = useMemo(() => {
    const unverifieds = data?.unverifieds ?? [];
    return unverifieds.filter((unverified) => {
      const matchesSearch =
        unverified.name
          .toLowerCase()
          .includes(unverifiedSearch.toLowerCase()) ||
        unverified.email.toLowerCase().includes(unverifiedSearch.toLowerCase());

      return matchesSearch;
    });
  }, [unverifiedSearch, data]);

  // Statistics calculations
  const stats = useMemo(() => {
    const users = data?.users ?? [];
    const rescuers = data?.rescuers ?? [];
    const unverifieds = data?.unverifieds ?? [];

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalRescuers: rescuers.length,
      activeRescuers: rescuers.filter((r) => r.status === "active").length,
      totalUnverifieds: unverifieds.length,
      activeUnverifieds: unverifieds.filter((u) => u.status === "active")
        .length,
    };
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <SidebarHeader
          header="User Management"
          description="Manage users, rescuers, and unverified with comprehensive controls"
          icon={Users}
        />
        <div className="w-full mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error loading data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gap-3 mt-3 flex flex-col">
      <SidebarHeader
        header="User Management"
        description="Manage users, rescuers, and unverified with comprehensive controls"
        icon={Users}
      />
      {isLoading ? (
        <StatsLoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <GlowingWrapper>
            <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
              <ChartRadialStack
                label="Users"
                value={stats.totalUsers || 0}
                description="Total users"
              />
            </Card>
          </GlowingWrapper>

          <GlowingWrapper>
            <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
              <ChartRadialStack
                label="Rescuers"
                value={stats.totalRescuers || 0}
                description="Total rescuers"
              />
            </Card>
          </GlowingWrapper>
          <GlowingWrapper>
            <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
              <ChartRadialStack
                label="Unverified"
                value={stats.totalUnverifieds || 0}
                description="Total unverified"
              />
            </Card>
          </GlowingWrapper>
        </div>
      )}

      {/* Main Content */}
      <Card className="border-0 shadow-xl @container/card py-0 bg-transparent">
        <CardContent className="p-0">
          <Tabs defaultValue="users" className="w-full gap-3 flex flex-col">
            <GlowingWrapper>
              <Card className="border-0.75 bg-transparent dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 p-3">
                <GlowingWrapper>
                  <TabsList className="grid w-auto grid-cols-3 shadow-sm">
                    <TabsTrigger
                      value="users"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Users ({filteredUsers.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="rescuers"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      Rescuers ({filteredRescuers.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="unverified"
                      className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                    >
                      Unverified ({filteredUnverifieds.length})
                    </TabsTrigger>
                  </TabsList>
                </GlowingWrapper>
              </Card>
            </GlowingWrapper>

            {/* Users Tab */}
            <GlowingWrapper>
              <TabsContent
                value="users"
                className="p-6 space-y-6 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <p className="text-sm">
                        Manage and monitor all registered users
                      </p>
                    </div>
                    <Badge variant="blue">{filteredUsers.length} users</Badge>
                  </div>

                  <UserFilters
                    searchTerm={userSearch}
                    onSearchChange={setUserSearch}
                  />
                </div>

                {isLoading ? (
                  <LoadingList />
                ) : (
                  <UserList
                    users={filteredUsers}
                    formatTimeAgo={(date: string) =>
                      new Date(date).toLocaleDateString()
                    }
                    onSelectUser={setSelectedUser}
                  />
                )}
              </TabsContent>

              {/* Rescuers Tab */}
              <TabsContent value="rescuers" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Rescuer Management
                      </h3>
                      <p className="text-sm">
                        Manage and monitor emergency responders
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-purple-500 text-white"
                    >
                      {filteredRescuers.length} rescuers
                    </Badge>
                  </div>

                  <RescuerFilters
                    searchTerm={rescuerSearch}
                    onSearchChange={setRescuerSearch}
                  />
                </div>

                {isLoading ? (
                  <LoadingList />
                ) : (
                  <RescuerList
                    rescuers={filteredRescuers}
                    formatTimeAgo={(date: Date) =>
                      new Date(date).toLocaleDateString()
                    }
                    onSelectRescuer={setSelectedUser}
                  />
                )}
              </TabsContent>

              {/* Unverified Tab */}
              <TabsContent value="unverified" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Unverified Management
                      </h3>
                      <p className="text-sm">
                        Manage and monitor unverified users
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gray-500 text-white"
                    >
                      {filteredUnverifieds.length} unverified
                    </Badge>
                  </div>

                  <UnverifiedFilters
                    searchTerm={unverifiedSearch}
                    onSearchChange={setUnverifiedSearch}
                  />
                </div>

                {isLoading ? (
                  <LoadingList />
                ) : (
                  <UnverifiedList
                    unverified={filteredUnverifieds}
                    onSelectUnverified={setSelectedUser}
                  />
                )}
              </TabsContent>
            </GlowingWrapper>
            {selectedUser && (
              <UserModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
    // </div>
  );
}
