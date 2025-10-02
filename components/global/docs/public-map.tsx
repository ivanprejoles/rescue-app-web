"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import VideoText from "@/components/ui/video-text";
import { useWeatherStore } from "@/hooks/use-meteo-storage";
import { MapData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import React from "react";

const LeafletMap = dynamic(
  () => import("@/components/global/Docs/leaflet-map"),
  {
    ssr: false,
  }
);

async function fetchMarkers() {
  const res = await fetch("/api/public/maps", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch markers");
  }
  return res.json();
}

export default function PublicMap() {
  const { weekly, selectedDayIndex } = useWeatherStore();

  const {
    data: reports,
    isLoading,
    error,
  } = useQuery<MapData>({
    queryKey: ["markers"],
    queryFn: fetchMarkers,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading markers...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {/* <div className="w-full h-full absolute top-0 left-0 bg-white">
        <Ripple />
      </div> */}
      <ContainerScroll
        titleComponent={
          <>
            <h1
              className={cn(
                "text-xl md:text-4xl font-semibold",
                weekly[selectedDayIndex] &&
                  weekly[selectedDayIndex].weather.color == "light"
                  ? "text-black"
                  : "text-white"
              )}
            >
              Find Your Nearest <br />
            </h1>
            <VideoText
              src="https://cdn.magicui.design/ocean-small.webm"
              content="Evacuation Point"
              className="h-44 w-full"
            />
          </>
        }
      >
        {/* <img
          src={`\images\stormy-background.png`}
          alt="map"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}
        {reports && (
          <LeafletMap
            markers={reports.markers}
            evacuationCenters={reports.evacuationCenters}
          />
        )}
      </ContainerScroll>
    </>
  );
}
