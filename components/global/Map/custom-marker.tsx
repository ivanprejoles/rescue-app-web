import React, { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { StoredMarkerType } from "@/lib/types";
import { createGeoapifyIcon } from "@/lib/map/marker-icon";
import { Card, CardContent } from "@/components/ui/card";
import { useMapStore } from "@/hooks/useMapStore";
import type { Marker as LeafletMarker } from "leaflet";

interface CustomMarkerProps {
  marker: StoredMarkerType;
  iconPicker: {
    iconName: string; // e.g. "tree", "fire", "hospital"
    color: string; // e.g. "#52b74c"
    iconColor: string;
  };
  onClick?: (marker: StoredMarkerType) => void;
  children?: React.ReactNode; // Optional children for Popup content
}

export function CustomMarker({
  marker,
  iconPicker,
  onClick,
  children,
}: CustomMarkerProps) {
  const { activeMarkerId, setActiveMarkerId } = useMapStore();
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!markerRef.current) return;

    if (activeMarkerId === marker.id) {
      console.log("its running!!");
      markerRef.current.openPopup();
    }
    // else {
    //   console.log("its running!");
    //   markerRef.current.closePopup();
    // }
  }, [activeMarkerId, marker.id]);

  const handleClick = () => {
    if (onClick) onClick(marker); // direct click handler passed from parent
    // setActiveMarkerId(marker.id); // set active marker on direct click too
  };

  const icon = createGeoapifyIcon(
    iconPicker.color,
    iconPicker.iconName,
    iconPicker.iconColor
  );

  return (
    <Marker
      ref={markerRef}
      position={[marker.latitude, marker.longitude]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup
        autoClose={false}
        closeOnClick={false}
        eventHandlers={{
          remove: () => setActiveMarkerId(null),
        }}
      >
        <Card className="w-72 h-auto overflow-auto">
          <CardContent className="h-auto w-auto">{children}</CardContent>
        </Card>
      </Popup>
    </Marker>
  );
}
