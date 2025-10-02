"use client";
import { GridPattern } from "@/components/ui/grid-pattern";
import PublicMap from "@/components/global/Docs/public-map";
import BentoGrid from "@/components/global/Docs/bento-grid";
import CanvasRevealCard from "@/components/global/Docs/canvas-reveal-card";
import DownloadSection from "@/components/global/Docs/3d-download-section";
import MarkerTypeCard from "@/components/global/Docs/marker-type-slider";
import WeatherForecast from "@/components/global/Docs/weather-forecast";
import { useWeatherStore } from "@/hooks/use-meteo-storage";
import { cn } from "@/lib/utils";

export default function PublicPage() {
  const { weekly, selectedDayIndex } = useWeatherStore();

  return (
    <>
      <main className="w-full h-screen relative">
        <WeatherForecast />
      </main>

      {/* public map */}
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

      {/* Weather Alerts Section */}
      <div className="w-full h-auto mx-auto px-6 relative bg-[#F4F5F6]">
        {/* background */}
        <div className="absolute  inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        {/* grid */}
        <div className="max-w-4xl flex flex-col items-center mx-auto lg:pt-32 md:pt-24 pt-16">
          <BentoGrid />
        </div>

        {/* marker type slider */}
        <div className="h-auto max-w-4xl flex flex-col items-center mx-auto lg:py-32 md:py-24 py-16">
          <MarkerTypeCard />
        </div>
      </div>

      {/* Features Section */}
      <div className="relative w-full h-auto">
        <div className="absolute  inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern
            className="bg-neutral-950"
            containerClassName="bg-neutral-900"
            shadow="shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
          />
        </div>
        <div className="h-auto relative max-w-4xl mx-auto pt-12">
          <CanvasRevealCard />
        </div>

        {/* App Download Section */}
        <div className="h-auto max-w-4xl mx-auto pb-12 pt-4">
          <DownloadSection />
        </div>
      </div>
    </>
  );
}
