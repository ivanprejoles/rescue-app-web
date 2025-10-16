"use client";

import RotatingSlider from "@/components/ui/card-slider";
import { rotatingSliderCard } from "@/lib/constants";
import React from "react";

const MarkerTypeCard = () => {
  return (
    <div className="container relative z-10 lg:max-w-[960px] md:max-w-3xl xs:max-w-md">
      <h2 className="font-semibold tracking-tighter text-black md:text-7xl sm:text-5xl text-4xl">
        Specialized Map Markers
      </h2>
      <p className="mt-4 leading-tight text-black tracking-tight lg:mt-5 sm:mt-3 md:text-lg">
        Unique icons designed to highlight detailed locations and vital
        information at a glance.
      </p>
      <RotatingSlider items={rotatingSliderCard} />
    </div>
  );
};

export default MarkerTypeCard;
