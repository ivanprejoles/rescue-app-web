"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix marker icon (for Vite, Webpack/Cra)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Define map bounds for Kawit, Cavite (expanded)
const kawitBoundary = [
  [14.4, 120.85], // Southwest lat, lng
  [14.49, 120.96], // Northeast lat, lng
];

export default function LocationPickerMap({ latitude, longitude, onChange }) {
  // Use a default position for the map if no coordinates are provided
  const initialPosition =
    latitude && longitude ? [latitude, longitude] : [14.444, 120.903]; // Center of Kawit

  // Component to handle map clicks and update marker position
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng); // Update parent state with new lat/lng
      },
    });

    // Only render the marker if valid latitude and longitude are available
    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null;
  }

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      style={{ height: 300, width: "100%" }}
      scrollWheelZoom={false} // Disable scroll wheel zoom if not desired
      maxBounds={kawitBoundary} // Set the geographical boundary [3]
      maxBoundsViscosity={1} // Makes the boundary rigid, preventing drag beyond it [3]
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Optional: Add a rectangle to visually show the boundary */}
      {/* <Rectangle bounds={kawitBoundary} pathOptions={{ color: 'blue', weight: 2, dashArray: '4' }} /> */}
      <LocationMarker />
    </MapContainer>
  );
}
