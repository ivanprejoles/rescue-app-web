"use client";

import { useMemo, useState } from "react";
import UsablePin from "./usable-pin";
import { RotatingSliderProps } from "@/lib/types";

interface Props {
  items: RotatingSliderProps[];
}

export default function RotatingSlider({ items }: Props) {
  const quantity = items.length;
  const [isPaused, setIsPaused] = useState(false);

  const renderedItems = useMemo(
    () =>
      items.map((label, index) => (
        <div
          key={index}
          className="item"
          style={
            {
              "--position": index + 1,
              "--quantity": quantity,
            } as React.CSSProperties
          }
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <UsablePin
            className=" text-white w-[160px] h-[200px] bg-black/50 border-slate-700"
            containerClassName=""
            title={label.title}
            background={"/images/honeycomb-bg.jpg"}
            description={label.description}
            image={label.image}
          />
        </div>
      )),
    [items, quantity]
  );

  return (
    <div className="banner">
      <div
        className="slider bottom-28 my-auto"
        style={
          {
            "--quantity": quantity,
            animationPlayState: isPaused ? "paused" : "running",
          } as React.CSSProperties
        }
      >
        {renderedItems}
      </div>
    </div>
  );
}
