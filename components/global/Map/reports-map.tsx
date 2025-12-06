/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useQueryClient } from "@tanstack/react-query";
import ResizeFix from "./ResizeFix";
import LegendPopover from "./legend-popover";
import MarkerMaker from "./marker-maker";
import { CustomMarker } from "./custom-marker";
import { useMapToggleStore } from "@/hooks/use-mapToggleStore";
import { legendMarker, statusMarkerColor, typeConfigs } from "@/lib/constants";
import { toggleReportSelection } from "@/lib/map/MarkerHandlers";
import { kawitBounds, kawitCenter } from "@/lib/map/kawitBounds";
import { MapData, StoredMarkerType } from "@/lib/types";
import {
  callNumber,
  capitalize,
  // capitalizeFirstLetter,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";
// import { MapModal } from "../modal/add-marker-map-modal";
import { ContactButton } from "@/components/ui/contact-button";
import { Ambulance, MapPin, Phone, User } from "lucide-react";
import RenderLocations from "./render-locations";
import { useUpdateAddMapModal } from "@/hooks/modals/use-update-add-map-modal";
import Image from "next/image";
import { ReturnToCenterControl } from "../docs/return-button";

export default function ReportsMap({ reports }: { reports?: MapData }) {
  const queryClient = useQueryClient();
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { openModal } = useUpdateAddMapModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onMarkerTypeSelect = (type: string) => {
    // setSelectedType(type);
    // setModalOpen(true);
    openModal(
      type === "Evacuation" ? ("evacuation" as never) : ("marker" as never),
      type !== "Evacuation" && { type: type.toLowerCase() }
    );
  };

  // const closeModal = () => {
  //   setSelectedType(null);
  //   setModalOpen(false);
  // };

  // We will subscribe to all toggle keys individually to avoid object recreation
  const toggleStates = legendMarker.reduce((acc, layer) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    acc[layer.key] = useMapToggleStore(
      (state) => state[`show${capitalize(layer.key)}`]
    );
    return acc;
  }, {} as Record<string, boolean>);

  const [selectedReports, setSelectedReports] = useState<StoredMarkerType[]>(
    []
  );
  // const [selectedType, setSelectedType] = useState<string | undefined>(
  //   undefined
  // );
  // const [pendingType, setPendingType] = useState<string | null>(null);

  useEffect(() => {
    const cached = queryClient.getQueryData(["markers"]);
  }, [queryClient]);

  const handleMarkerClick = useCallback((report: StoredMarkerType) => {
    setSelectedReports((prev) => toggleReportSelection(prev, report));
  }, []);

  const renderMarkers = () => {
    if (!reports?.markers) return null;

    return reports.markers.map((report, index) => {
      const legend = legendMarker.find((l) => l.key === report.type);
      const rescuerStatus = report.rescuer;
      const reportStatus = report.status;

      if (!legend) return null;

      if (!toggleStates[legend.key]) return null;

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
                  ] ?? statusMarkerColor.Pending
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <div className="grid grid-cols-1 gap-2">
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

  const renderBarangays = () => {
    if (!reports?.barangays) return null;

    const legend = legendMarker.find((l) => l.key === "barangay");
    if (!legend) return null;

    if (!toggleStates[legend.key]) return null;

    return reports.barangays.map((brgy, index) => {
      if (!brgy.latitude || !brgy.longitude) return null;

      return (
        <CustomMarker
          key={index}
          marker={{
            id: brgy.id,
            latitude: brgy.latitude,
            longitude: brgy.longitude,
            type: "barangay",
            description: brgy.address || "",
          }}
          iconPicker={{
            iconName: legend.iconName,
            color: legend.color,
            iconColor: legend.iconColor,
          }}
          onClick={handleMarkerClick}
        >
          <h1 className="w-full text-center mb-2 text-sm font-bold">
            Barangay {brgy.name}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ContactButton
              icon={Phone}
              label="Phone"
              value={brgy.phone as string}
              onClick={() => callNumber(brgy.phone as string)}
              iconColor="text-blue-400"
            />
            <ContactButton
              icon={MapPin}
              label="Barangay"
              value={brgy.name as string}
              onClick={() =>
                openGoogleMaps({
                  lat: brgy.latitude as number,
                  lng: brgy.longitude as number,
                })
              }
              iconColor="text-blue-400"
            />
          </div>
        </CustomMarker>
      );
    });
  };

  const renderEvacuations = () => {
    if (!reports?.evacuationCenters) return null;

    const legend = legendMarker.find((l) => l.key === "evacuationCenters");
    if (!legend) return null;

    if (!toggleStates[legend.key]) return null;

    return reports.evacuationCenters.map((evac, index) => {
      if (!evac.latitude || !evac.longitude) return null;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

  if (!isClient) {
    return null; // or a loader placeholder
  }

  return (
    <div className="relative rounded-lg overflow-hidden h-full w-full">
      <MapContainer
        key={"full-screen-map"}
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
        {renderBarangays()}
        {renderEvacuations()}
        <RenderLocations userType="admin" />
      </MapContainer>

      <MarkerMaker onSelect={onMarkerTypeSelect} />
      <LegendPopover />
    </div>
  );
}
