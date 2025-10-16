"use client";

import React, { useEffect } from "react";
import WeeklyForecastInteractive from "./fullweek-weather";
import WordPullUp from "@/components/ui/word-pull-up";
import BlurIn from "@/components/ui/word-blur-in";
import Counter from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import { fetchWeeklyWeatherData } from "@/hooks/use-meteo";
import { useWeatherStore } from "@/hooks/use-meteo-storage";

const WeatherForecast = () => {
  const { setWeeklyData, weekly, selectedDayIndex } = useWeatherStore();
  const dataPromise = fetchWeeklyWeatherData(14.44656, 120.90803);

  useEffect(() => {
    let isMounted = true;
    dataPromise.then((data) => {
      if (isMounted && data) {
        setWeeklyData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
        {/* Background video for light/dark mode */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src={
            weekly[selectedDayIndex] && weekly[selectedDayIndex].weather.video
          }
        ></video>

        {weekly[selectedDayIndex] &&
        weekly[selectedDayIndex].weather.color == "light" ? (
          <>
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center bg-white",
                "[mask-image:radial-gradient(ellipse_at_center,transparent_60%,white)]"
              )}
            ></div>
            <div className="z- w-full h-14 bottom-0 left-0 right-0 absolute bg-gradient-to-t from-white via-white/90 to-transparent" />
          </>
        ) : (
          <>
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center bg-black",
                "[mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_90%)]"
              )}
            ></div>
            <div className="z- w-full h-14 bottom-0 left-0 right-0 absolute bg-gradient-to-t from-black via-black/90 to-transparent" />
          </>
        )}
      </div>

      <div className="w-full h-10/12 md:h-full flex flex-col border p-3 md:p-6">
        <div className="flex-1 grid grid-cols-4 border pt-10 md:pt-16">
          {/* left */}
          <div className="w-full h-full relative col-span-2">
            {/* <h1 cx */}
            <WordPullUp
              className="font-sans font-light text-3xl md:text-4xl text-white mb-3 mt-10 text-left"
              words={
                weekly[selectedDayIndex] &&
                weekly[selectedDayIndex].weather.desc
              }
            />

            <BlurIn className="text-white/50 text-xs leading-relaxed max-w-md mb-6 text-left">
              {weekly[selectedDayIndex] &&
                weekly[selectedDayIndex].weather.detailedDesc}
            </BlurIn>
            <div className="text-6xl font-medium text-white mr-8">
              <Counter
                value={
                  weekly[selectedDayIndex] && weekly[selectedDayIndex].tempMax
                }
                className="text-6xl font-bold"
              />
              °
            </div>
            <div className="text-white/70 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-sm">⚲ Kawit, Cavite </span>
              </div>
            </div>
          </div>

          {/* right */}
        </div>
        <WeeklyForecastInteractive />
      </div>
    </>
  );
};

export default WeatherForecast;
