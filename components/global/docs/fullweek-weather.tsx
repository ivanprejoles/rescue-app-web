import React, { useEffect, useRef, useState } from "react";
import { useWeatherStore } from "@/hooks/use-meteo-storage";
import useMediaQuery from "@/lib/media-query";

// Helper to get weekday name from date string
function getWeekdayName(dateString: string, isMobile: boolean) {
  const date = new Date(dateString);
  if (isMobile) {
    const dayShort = date.toLocaleDateString(undefined, { weekday: "short" });
    return dayShort.charAt(0).toUpperCase();
  }
  const fullDay = date.toLocaleDateString(undefined, { weekday: "long" });
  return fullDay.charAt(0).toUpperCase() + fullDay.slice(1);
}

export default function WeeklyForecastInteractive() {
  const weeklyData = useWeatherStore((state) => state.weekly);
  const selectedDayIndex = useWeatherStore((state) => state.selectedDayIndex);
  const selectDay = useWeatherStore((state) => state.selectDay);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 120;
  const horizontalPadding = 32;

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (width === 0 || weeklyData.length === 0) {
    return <div ref={containerRef} className="w-full h-[180px]" />;
  }

  const maxTemp = Math.max(...weeklyData.map((f) => f.tempMax));
  const scaledTemps = weeklyData.map((f) => (f.tempMax / maxTemp) * height);

  function generateSmoothPath(points: number[], width: number, height: number) {
    if (points.length < 2) return "";
    const effectiveWidth = width - 2 * horizontalPadding;
    const gap = effectiveWidth / (points.length - 1);
    let d = `M ${horizontalPadding} ${height - points[0]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const x0 = horizontalPadding + i * gap;
      const y0 = height - points[i];
      const x1 = horizontalPadding + (i + 1) * gap;
      const y1 = height - points[i + 1];
      const cx1 = x0 + gap / 2;
      const cy1 = y0;
      const cx2 = x1 - gap / 2;
      const cy2 = y1;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x1} ${y1}`;
    }
    return d;
  }

  const pathD = generateSmoothPath(scaledTemps, width, height);

  function handleDotClick(i: number) {
    selectDay(i);
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full md:py-6 relative bg-transparent select-none"
      style={{ height: "180px" }}
    >
      <div className="flex justify-between mb-8 md:mb-10 text-center text-white/90 text-sm select-none md:px-1 md:gap-0 gap-1">
        {weeklyData.map(({ date, tempMax }, index) => (
          <div key={index} className="flex flex-col items-center w-12">
            <span className="font-light text-xs">
              {getWeekdayName(date, isMobile)}
            </span>
            <span className="font-semibold text-xl md:text-2xl">
              {Math.round(tempMax)}°
            </span>
          </div>
        ))}
      </div>

      <svg
        className="w-full"
        height={height}
        style={{ overflow: "visible", paddingRight: "4px" }}
      >
        <defs>
          <linearGradient id="fade-ends" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Filter for subtle glow */}
          <filter
            id="lightGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6" // bigger blur
              floodColor="white"
              floodOpacity="0.9" // higher opacity for brightness
            />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3" // layered smaller glow to intensify
              floodColor="white"
              floodOpacity="0.6"
            />
          </filter>
        </defs>

        {/* Curved white line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#fade-ends)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {scaledTemps.map((point, i) => {
          const cx =
            horizontalPadding +
            (i * (width - 2 * horizontalPadding)) / (scaledTemps.length - 1);
          const cy = height - point;
          const radius = 14;
          const isSelected = i === selectedDayIndex;
          const weatherIcon = weeklyData[i].weather.icon;

          return (
            <g
              key={i}
              tabIndex={0}
              role="button"
              onClick={() => handleDotClick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDotClick(i);
                }
              }}
              style={{ cursor: "pointer" }}
              aria-label={`Click for details of ${getWeekdayName(
                weeklyData[i].date,
                isMobile
              )}`}
            >
              <foreignObject
                x={cx - (radius * 3) / 2}
                y={cy - (radius * 3) / 2}
                width={radius * 3}
                height={radius * 3}
                style={{ overflow: "visible", pointerEvents: "auto" }}
              >
                <div
                  style={{
                    width: radius * 3,
                    height: radius * 3,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    userSelect: "none",
                    color: "black",
                    fontSize: 24,
                    lineHeight: 1,
                    border: isSelected
                      ? "2px solid white"
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    filter: isSelected ? "url(#lightGlow)" : "none",
                    transition: "border-color 0.3s ease, filter 0.3s ease",
                  }}
                >
                  {weatherIcon}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
