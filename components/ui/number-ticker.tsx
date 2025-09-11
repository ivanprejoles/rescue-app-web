"use client";

import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  initial?: number;
  duration?: number; // ms
  className?: string;
}

export default function Counter({
  value = 100,
  initial = 0,
  duration = 1500, // much faster default
  className,
  ...props
}: CounterProps) {
  const count = useMotionValue(initial);
  const [displayValue, setDisplayValue] = useState(initial);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration / 1000, // framer uses seconds
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return controls.stop;
  }, [value, duration, count]);

  return (
    <div
      className={cn(
        "inline-block text-black dark:text-white tracking-normal",
        className
      )}
      {...props}
    >
      {Math.round(displayValue)}
    </div>
  );
}
