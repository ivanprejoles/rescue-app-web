"use client";

import React, { useEffect, useState } from "react";
import { GlowingEffect } from "./glowing-effect";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

const Ripple: React.FC<RippleProps> = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 flex overflow-hidden items-center justify-center  [mask-image:linear-gradient(to_bottom,white,transparent)]">
      {Array.from({ length: numCircles }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-ripple rounded-full bg-foreground/30 shadow-xl border top-full md:top-9/12 left-1/2"
          style={
            {
              "--i": i,
              "--duration": "2s",
              width: `${mainCircleSize + i * 200}px`,
              height: `${mainCircleSize + i * 200}px`,
              opacity: mainCircleOpacity - i * 0.03,
              animationDelay: `${i * 0.08}s`,
              borderStyle: i === numCircles - 1 ? "dashed" : "solid",
              borderWidth: "1px",
              borderColor: `rgba(var(--foreground-rgb), ${(5 + i * 5) / 100})`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default Ripple;
