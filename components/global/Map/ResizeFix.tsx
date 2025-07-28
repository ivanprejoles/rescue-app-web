"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function ResizeFix() {
  const map = useMap();

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timeout);
  }, [map]);

  return null;
}
