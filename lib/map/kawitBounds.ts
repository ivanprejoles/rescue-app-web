import L from "leaflet";

export const kawitBounds = L.latLngBounds(
  L.latLng(14.425 - 0.08, 120.87 - 0.15), // original SW minus half of 5x span
  L.latLng(14.465 + 0.08, 120.93 + 0.15) // original NE plus half of 5x span
);
