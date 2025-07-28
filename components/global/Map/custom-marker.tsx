import React from "react";
import { Marker, Popup } from "react-leaflet";
import { StoredMarkerType } from "@/lib/types";
import { createGeoapifyIcon } from "@/lib/map/marker-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const icon = createGeoapifyIcon(
    iconPicker.color,
    iconPicker.iconName,
    iconPicker.iconColor
  );

  return (
    <Marker
      key={marker.id}
      position={[marker.latitude, marker.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick && onClick(marker),
      }}
    >
      <Popup>
        <Card className="w-72 h-auto overflow-auto">
          <CardContent className="h-auto w-auto">{children}</CardContent>
        </Card>
      </Popup>
    </Marker>
  );
}
