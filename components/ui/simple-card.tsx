"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import Image from "next/image";
import useMediaQuery from "@/lib/media-query"; // your media query hook path
import { cn } from "@/lib/utils"; // your classnames helper utility

interface CardProps {
  children?: React.ReactNode;
  bodyClassName?: string;
  icon: string;
  title?: string;
  description?: string;
  containerClassName: string;
}

const SimpleCard: React.FC<CardProps> = ({
  children,
  icon,
  title = "Svelte is Vibe",
  description = "Svelte is a fun way to build web applications.",
  containerClassName = "bg-black",
}) => {
  return (
    <div className="relative mx-auto w-full rounded-lg border-zinc-300 dark:border-zinc-800 dark:bg-[#09090B] shadow-sm">
      <div className="relative w-full ">
        <div className="relative z-20 mx-auto">
          {children ?? (
            <Card title={title} description={description} icon={icon}>
              <CanvasRevealEffect
                animationSpeed={5.1}
                colors={[
                  [236, 72, 153],
                  [232, 121, 249],
                ]}
                dotSize={2}
                containerClassName={containerClassName}
              />
              <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCard;

const Card = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: string;
  children?: React.ReactNode;
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Desktop only hover handlers enabled if not mobile
  const onMouseEnter = () => {
    if (!isMobile) setHovered(true);
  };
  const onMouseLeave = () => {
    if (!isMobile) setHovered(false);
  };

  // Mobile only tap toggle
  const onToggle = () => {
    if (isMobile) setActive((prev) => !prev);
  };

  // Unified state for showing overlay and styles
  const isActive = active || hovered;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onToggle}
      onTouchStart={onToggle}
      className="overflow-hidden group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 h-[10rem] relative"
      role="button"
      tabIndex={0}
      aria-pressed={active}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div
          className={cn(
            "text-center transition duration-200 w-full mx-auto flex items-center justify-center",
            {
              "-translate-y-4 opacity-0": isActive,
              "translate-y-10 md:translate-y-1 opacity-100": !isActive,
            }
          )}
        >
          <Image src={icon} alt="Icon description" width={66} height={65} />
        </div>
        <h2
          className={cn(
            "dark:text-white text-xl relative z-10 text-black font-bold transition duration-200",
            {
              "opacity-100 text-white -translate-y-2": isActive,
              "opacity-0": !isActive,
            }
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "text-sm font-light z-10 leading-snug tracking-snugger text-gray-500 text-left md:leading-tight transition duration-200",
            {
              "opacity-100 -translate-y-2": isActive,
              "opacity-0": !isActive,
            }
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
