"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getRescueStatusColor, getRescuerStatusColor } from "@/lib/utils";
import { UserList } from "@/components/global/User/user-list";
import { UserModal } from "@/components/global/modal/user-modal";
import { RescuerList } from "@/components/global/Rescuer/rescuer-list";
// import { RescuerModal } from "@/components/global/modal/rescuer-modal";
import { UserFilters } from "@/components/global/User/user-filter";
import { RescuerFilters } from "@/components/global/Rescuer/rescuer-filter";
import type { User } from "@/lib/types";
import { useAdminQuery } from "@/lib/useQuery";
import { getRescuersAndUsersClient } from "@/lib/client-fetchers";
import SidebarHeader from "../header";
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Loading skeleton component
const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const LoadingList = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
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
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function ClientSideUser() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [selectedRescuer, setSelectedRescuer] = useState<User | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] = useState("all");

  const [rescuerSearch, setRescuerSearch] = useState("");
  const [rescuerStatus, setRescuerStatus] = useState("all");

  const { data, isLoading, error } = useAdminQuery<{
    users: User[];
    rescuers: User[];
  }>(["rescuers-users"], getRescuersAndUsersClient);

  console.log(data?.users);
  console.log(data?.rescuers);

  // Filter users
  const filteredUsers = useMemo(() => {
    const users = data?.users ?? [];
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase());

      const matchesStatus = userStatus === "all" || user.status === userStatus;

      return matchesSearch && matchesStatus;
    });
  }, [userSearch, userStatus, data]);

  // Filter rescuers
  const filteredRescuers = useMemo(() => {
    const rescuers = data?.rescuers ?? [];
    return rescuers.filter((rescuer) => {
      const matchesSearch =
        rescuer.name.toLowerCase().includes(rescuerSearch.toLowerCase()) ||
        rescuer.email.toLowerCase().includes(rescuerSearch.toLowerCase());

      const matchesStatus =
        rescuerStatus === "all" || rescuer.status === rescuerStatus;

      return matchesSearch && matchesStatus;
    });
  }, [rescuerSearch, rescuerStatus, data]);

  // Statistics calculations
  const stats = useMemo(() => {
    const users = data?.users ?? [];
    const rescuers = data?.rescuers ?? [];

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalRescuers: rescuers.length,
      activeRescuers: rescuers.filter((r) => r.status === "active").length,
    };
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <SidebarHeader
          header="User Management"
          description="Manage users and rescuers"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="min-h-screen">
      <SidebarHeader
        header="User Management"
        description="Manage users and rescuers with comprehensive controls"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-black">
        {/* Statistics Cards */}
        {isLoading ? (
          <StatsLoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md @container/card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs">{stats.activeUsers} active users</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md @container/card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs">
                  {stats.totalUsers > 0
                    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                    : 0}
                  % of total users
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md @container/card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rescuers
                </CardTitle>
                <Shield className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold ">{stats.totalRescuers}</div>
                <p className="text-xs">
                  {stats.activeRescuers} active rescuers
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md @container/card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Response Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRescuers > 0
                    ? Math.round(
                        (stats.activeRescuers / stats.totalRescuers) * 100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs">Active rescuer availability</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Card className="border-0 shadow-xl @container/card">
          <CardContent className="p-0">
            <Tabs defaultValue="users" className="w-full">
              <div className="border-b px-6 py-4">
                <TabsList className="grid w-full max-w-md grid-cols-2 shadow-sm">
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
                </TabsList>
              </div>

              {/* Users Tab */}
              <TabsContent value="users" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <p className="text-sm">
                        Manage and monitor all registered users
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {filteredUsers.length} users
                    </Badge>
                  </div>

                  <UserFilters
                    searchTerm={userSearch}
                    onSearchChange={setUserSearch}
                    statusFilter={userStatus}
                    onStatusChange={setUserStatus}
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
                    getStatusColor={getRescueStatusColor}
                    onSelectUser={setSelectedUser}
                  />
                )}

                {selectedUser && (
                  <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    getStatusColor={getRescueStatusColor}
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
                      className="bg-purple-100 text-purple-800"
                    >
                      {filteredRescuers.length} rescuers
                    </Badge>
                  </div>

                  <RescuerFilters
                    searchTerm={rescuerSearch}
                    onSearchChange={setRescuerSearch}
                    statusFilter={rescuerStatus}
                    onStatusChange={setRescuerStatus}
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
                    getStatusColor={getRescuerStatusColor}
                    onSelectRescuer={setSelectedUser}
                  />
                )}

                {/* {selectedRescuer && (
                  <RescuerModal
                    rescuer={selectedRescuer}
                    onClose={() => setSelectedRescuer(null)}
                    getStatusColor={getRescuerStatusColor}
                  />
                )} */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
