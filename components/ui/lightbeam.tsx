"use client";

import { cn } from "@/lib/utils";

type Variant = "stripe" | "fire" | "sunset" | "emerald";

const gradientStops: Record<Variant, { start: string; end: string }> = {
  stripe: { start: "#1fa2ff", end: "#a6ffcb" }, // blue → green
  fire: { start: "#ff512f", end: "#dd2476" }, // red → magenta
  sunset: { start: "#ff7e5f", end: "#feb47b" }, // orange → peach
  emerald: { start: "#56ab2f", end: "#a8e063" }, // green → light green
};

export const LightBeams = ({
  className,
  variant = "stripe",
}: {
  className?: string;
  variant?: Variant;
}) => {
  const { start, end } = gradientStops[variant];

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      {/* === BEAMS === */}
      <svg
        width="380"
        height="315"
        viewBox="0 0 380 315"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
      >
        <g
          filter="url(#filter0_f_120_7473)"
          className="animate-[pulseLight_6s_ease-in-out_infinite]"
        >
          <circle cx="34" cy="52" r="114" fill={start} />
        </g>
        <g
          filter="url(#filter1_f_120_7473)"
          className="animate-[pulseLight_8s_ease-in-out_infinite]"
        >
          <circle cx="332" cy="24" r="102" fill={end} />
        </g>
        <g
          filter="url(#filter2_f_120_7473)"
          className="animate-[pulseLight_10s_ease-in-out_infinite]"
        >
          <circle cx="191" cy="53" r="102" fill={start} />
        </g>

        {/* defs unchanged */}
        <defs>
          <filter
            id="filter0_f_120_7473"
            x="-192"
            y="-174"
            width="452"
            height="452"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="56" />
          </filter>
          <filter
            id="filter1_f_120_7473"
            x="70"
            y="-238"
            width="524"
            height="524"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="80" />
          </filter>
          <filter
            id="filter2_f_120_7473"
            x="-71"
            y="-209"
            width="524"
            height="524"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
