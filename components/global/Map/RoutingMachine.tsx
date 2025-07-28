"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet-routing-machine";

export default function RoutingMachine({
  waypoints,
}: {
  waypoints: LatLngExpression[];
}) {
  const map = useMap();
  const routingControlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const control = L.Routing.control({
      waypoints,
      lineOptions: { styles: [{ color: "blue", weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
    }).addTo(map);

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
}
