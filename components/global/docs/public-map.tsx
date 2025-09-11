"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import VideoText from "@/components/ui/video-text";
import { useWeatherStore } from "@/hooks/use-meteo-storage";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import React from "react";

const LeafletMap = dynamic(
  () => import("@/components/global/Docs/leaflet-map"),
  {
    ssr: false,
  }
);

export default function PublicMap() {
  const { weekly, selectedDayIndex } = useWeatherStore();

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
        <LeafletMap />
      </ContainerScroll>
    </>
  );
}
