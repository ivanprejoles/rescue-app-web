import { GridPattern } from "@/components/ui/grid-pattern";
import BentoGrid from "@/components/global/docs/bento-grid";
import CanvasRevealCard from "@/components/global/docs/canvas-reveal-card";
import DownloadSection from "@/components/global/docs/3d-download-section";
import MarkerTypeCard from "@/components/global/docs/marker-type-slider";
import WeatherForecast from "@/components/global/docs/weather-forecast";
import MainHeader from "@/components/global/public/MainHeader";
import MainFooter from "@/components/global/public/MainFooter";
import WeatherTheme from "@/components/global/docs/weather-theme";

export default function PublicPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      suppressHydrationWarning
    >
      <MainHeader />
      <div className="relative z-10 text-white">
        <main className="w-full h-screen relative">
          <WeatherForecast />
        </main>
        <WeatherTheme />
        <div className="w-full h-auto mx-auto px-6 relative bg-[#F4F5F6]">
          <div className="absolute  inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="max-w-4xl flex flex-col items-center mx-auto lg:pt-32 md:pt-24 pt-16">
            <BentoGrid />
          </div>
          <div className="h-auto max-w-4xl flex flex-col items-center mx-auto lg:py-32 md:py-24 py-16">
            <MarkerTypeCard />
          </div>
        </div>
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
          <div className="h-auto max-w-4xl mx-auto pb-12 pt-4">
            <DownloadSection />
          </div>
        </div>
        <MainFooter />
      </div>
    </div>
  );
}
