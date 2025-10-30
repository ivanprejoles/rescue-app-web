/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

// Import your marker image from the public folder.
// Ensure marker.png is located at /public/images/marker.png
const customMarkerIcon = L.icon({
  iconUrl: "/images/marker.png",
  iconSize: [41, 41], // Adjust to the size of your marker image
  iconAnchor: [20.5, 41], // Point of the icon that corresponds to the marker's location
});

import BoundDragHandler from "./bound-non-sticky";

// IMPORTANT: We no longer need to import the default Leaflet icons or
// use L.Icon.Default.mergeOptions, as it's unreliable.
// The customIcon approach is more robust.
// We also no longer need to delete L.Icon.Default.prototype._getIconUrl.

const kawitBoundary: any = [
  [14.4, 120.85],
  [14.49, 120.96],
];

interface Props {
  latitude?: number;
  longitude?: number;
  onChange?: (
    lat: { toString: () => string },
    lng: { toString: () => string }
  ) => void;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: Props) {
  const initialPosition: LatLngExpression | undefined =
    latitude && longitude ? [latitude, longitude] : [14.444, 120.903];

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange?.(e.latlng.lat, e.latlng.lng);
      },
    });

    return latitude && longitude ? (
      // Pass the customIcon object directly to the Marker component's icon prop
      <Marker position={[latitude, longitude]} icon={customMarkerIcon} />
    ) : null;
  }

  return (
    <MapContainer
      key={"location-picker"}
      center={initialPosition}
      zoom={15}
      minZoom={13}
      maxZoom={18}
      style={{ height: 300, width: "100%" }}
      scrollWheelZoom={false}
      maxBounds={kawitBoundary}
      maxBoundsViscosity={0}
    >
      <BoundDragHandler bounds={kawitBoundary} />
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
