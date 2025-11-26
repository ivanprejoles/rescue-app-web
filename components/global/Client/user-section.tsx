"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import dynamic from "next/dynamic";
import React from "react";
import UserIncidentTable from "./user-incident-table";
import { ClientUser, MapEvacuationCenter, MapMarker } from "@/lib/types";
import ClientFullScreen from "./client-full-screen";

const LeafletMap = dynamic(
  () => import("@/components/global/docs/leaflet-map"),
  {
    ssr: false,
  }
);

type Props = {
  markers: MapMarker[];
  evacuationCenters: MapEvacuationCenter[];
  user: ClientUser;
};

const UserSection = ({ markers, evacuationCenters, user }: Props) => {
  return (
    <>
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
          <CardHeader>
            <div className="flex items-center justify-between h-auto">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Emergency Reports Map
                </CardTitle>
                <CardDescription>
                  Real-time geographic view of emergency reports (
                  {markers.length} visible) and evacuation centers (
                  {evacuationCenters.length} visible)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {/* <ShowAlertOnce /> */}
                <ClientFullScreen
                  markers={markers}
                  evacuationCenters={evacuationCenters}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[600px]">
              <LeafletMap
                markers={markers}
                evacuationCenters={evacuationCenters}
                userType={user.user_type}
              />
            </div>
          </CardContent>
        </Card>
      </GlowingWrapper>
      <UserIncidentTable
        markers={markers}
        evacuationCenters={evacuationCenters}
        groupBy="type"
        defaultCollapsed={false}
        user={user}
      />
    </>
  );
};

export default UserSection;
