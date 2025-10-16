"use client";

import { GridPattern } from "@/components/ui/grid-pattern";
import { useWeatherStore } from "@/hooks/use-meteo-storage";
import { cn } from "@/lib/utils";
import PublicMap from "./public-map";

const WeatherTheme = () => {
  const { weekly, selectedDayIndex } = useWeatherStore();

  return (
    <div
      className={cn(
        "w-full h-auto px-6 py-12 relative",
        weekly[selectedDayIndex] &&
          weekly[selectedDayIndex].weather.color == "light"
          ? "bg-white"
          : "bg-black"
      )}
    >
      {weekly[selectedDayIndex] &&
      weekly[selectedDayIndex].weather.color == "light" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            "[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent)]"
          )}
        >
          <GridPattern />
        </div>
      ) : (
        <>
          <div className="absolute  inset-0 [mask-image:radial-gradient(ellipse_at_center,white_50%,transparent_80%)]">
            <GridPattern
              className="bg-neutral-950"
              containerClassName="bg-neutral-900"
              shadow="shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
            />
          </div>
        </>
      )}
      <PublicMap />
    </div>
  );
};

export default WeatherTheme;
