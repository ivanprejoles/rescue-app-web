/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { kawitBounds, kawitCenter } from "@/lib/map/kawitBounds";
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import ResizeFix from "../Map/ResizeFix";
import {
  ClientUser,
  MapEvacuationCenter,
  MapMarker,
  StoredMarkerType,
} from "@/lib/types";
import { CustomMarker } from "../Map/custom-marker";
import { ContactButton } from "@/components/ui/contact-button";
import { Ambulance, MapPin, Phone, User } from "lucide-react";
import {
  callNumber,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";
import { legendMarker, statusMarkerColor, typeConfigs } from "@/lib/constants";
import { toggleReportSelection } from "@/lib/map/MarkerHandlers";
import BoundDragHandler from "@/lib/map/bound-non-sticky";
import Image from "next/image";
import { ReturnToCenterControl } from "./return-button";
import RenderLocations from "../Map/render-locations";
import { useLocationStore } from "@/hooks/use-marker-location";

interface Props {
  markers: MapMarker[];
  evacuationCenters: MapEvacuationCenter[];
  userType?: "user" | "rescuer";
}

export default function LeafletMap({
  markers,
  evacuationCenters,
  userType,
}: Props) {
  const [selectedReports, setSelectedReports] = useState<StoredMarkerType[]>(
    []
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMarkerClick = useCallback((report: any) => {
    setSelectedReports((prev) => toggleReportSelection(prev, report));
  }, []);

  // evacuation marker
  const renderEvacuations = () => {
    if (!evacuationCenters) return null;

    const legend = legendMarker.find((l) => l.key === "evacuationCenters");
    if (!legend) return null;

    return evacuationCenters.map((evac, index) => {
      if (!evac.latitude || !evac.longitude) return null;
      console.log(evac);

      return (
        <CustomMarker
          key={index}
          marker={{
            id: evac.id,
            latitude: evac.latitude,
            longitude: evac.longitude,
            type: "evacuationCenters",
            description: evac.address || "",
          }}
          iconPicker={{
            iconName: legend.iconName,
            color: legend.color,
            iconColor: legend.iconColor,
          }}
          onClick={handleMarkerClick}
        >
          <h1 className="w-full text-center text-sm mb-2 font-bold">
            {evac.name}
          </h1>
          <div className="w-full h-auto justify-center mb-2 text-sm font-bold relative flex">
            <div className="w-3/4 relative overflow-hidden rounded-md bg-white aspect-video text-sm font-bold">
              <Image
                alt="marker-image"
                src={evac.imageUrl || "/images/no-image-provided.png"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactButton
              icon={Phone}
              label="Phone"
              value={evac.phone as string}
              onClick={() => callNumber(evac.phone as string)}
              iconColor="text-blue-400"
            />
            <ContactButton
              icon={MapPin}
              label="Center"
              value={evac.name as string}
              onClick={() =>
                openGoogleMaps({
                  lat: evac.latitude as number,
                  lng: evac.longitude as number,
                })
              }
              iconColor="text-blue-400"
            />
          </div>
        </CustomMarker>
      );
    });
  };

  // report markers
  const renderMarkers = () => {
    if (!markers) return null;

    return markers.map((report, index) => {
      const legend = legendMarker.find((l) => l.key === report.type);
      const rescuerStatus = report.rescuer;
      const reportStatus = report.status;

      if (!legend) return null;
      console.log(report);

      return (
        <CustomMarker
          key={index}
          marker={report}
          iconPicker={{
            iconName: legend.iconName,
            color:
              rescuerStatus && reportStatus
                ? statusMarkerColor[
                    reportStatus as keyof typeof statusMarkerColor
                  ]
                : legend.color,
            iconColor: legend.iconColor,
          }}
          onClick={handleMarkerClick}
        >
          <h1 className="w-full text-center mb-2 text-sm font-bold">
            {report.type === "report"
              ? `${report.user?.name || "Guest"} Report`
              : typeConfigs[report.type].label}
          </h1>
          <div className="w-full h-auto justify-center mb-2 text-sm font-bold relative flex">
            <div className="w-3/4 relative overflow-hidden rounded-md bg-white aspect-video text-sm font-bold">
              <Image
                alt="marker-image"
                src={report.imageUrl || "/images/no-image-provided.png"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          {report.type === "report" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ContactButton
                icon={User}
                label="Email"
                value={report.user?.email as string}
                onClick={() =>
                  openGmailComposeWithRecipient(report.user?.email as string)
                }
                iconColor="text-green-400"
              />
              <ContactButton
                icon={Ambulance}
                label="Email"
                value={report.rescuer?.email as string}
                onClick={() =>
                  openGmailComposeWithRecipient(report.rescuer?.email as string)
                }
                iconColor="text-red-400"
              />
              <ContactButton
                icon={User}
                label="Phone"
                value={report.user?.phone_number as string}
                onClick={() => callNumber(report.user?.phone_number as string)}
                iconColor="text-green-400"
              />
              <ContactButton
                icon={Ambulance}
                label="Phone"
                value={report.rescuer?.phone_number as string}
                onClick={() =>
                  callNumber(report.rescuer?.phone_number as string)
                }
                iconColor="text-red-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <ContactButton
                icon={MapPin}
                label="Location"
                value={report.type}
                onClick={() =>
                  openGoogleMaps({
                    lat: report.latitude as number,
                    lng: report.longitude as number,
                  })
                }
                iconColor="text-green-400"
              />
            </div>
          )}
        </CustomMarker>
      );
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden h-full w-full  ">
      <MapContainer
        key={"main-map"}
        center={kawitCenter}
        zoom={15}
        minZoom={1}
        maxZoom={18}
        maxBoundsViscosity={0}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom="center"
        dragging={true}
        zoomControl={false}
        className="h-full w-full"
      >
        <ReturnToCenterControl center={kawitCenter} zoom={15} />
        <ZoomControl position="bottomright" />
        <ResizeFix />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {renderMarkers()}
        {renderEvacuations()}
        {userType && userType == "rescuer" && (
          <RenderLocations userType="rescuer" />
        )}
        {userType && userType == "user" && <RenderLocations userType="user" />}
      </MapContainer>
    </div>
  );
}
