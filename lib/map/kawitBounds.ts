import L, { LatLngExpression } from "leaflet";

export const kawitBounds = L.latLngBounds(
  L.latLng(14.39019, 120.81305), // left side moved 5 km east
  L.latLng(14.49981, 120.98691) // right side moved 5 km west
);

export const kawitCenter: LatLngExpression = [14.4461369, 120.8978516]; // Center of Kawit, Cavite
