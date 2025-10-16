"use client";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  shadow?: string;
  containerClassName?: string;
}

export function GridPattern({
  className = "bg-gray-50",
  shadow = "shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset]",
  containerClassName = "bg-gray-100",
}: Props) {
  const columns = 41;
  const rows = 40;
  return (
    <div
      className={cn(
        "flex  shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105",
        containerClassName
      )}
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px]  ${className} ${
                index % 2 === 0 ? "" : `${shadow}`
              }`}
            />
          );
        })
      )}
    </div>
  );
}
