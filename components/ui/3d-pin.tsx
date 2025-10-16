"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { GlowingWrapper } from "./glowing-effect";
import Image from "next/image";
import useMediaQuery from "@/lib/media-query";
import { motion } from "motion/react";

export const PinContainer = ({
  children,
  href,
  className,
  containerClassName,
  title,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  containerClassName?: string;
  title?: string;
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Desktop hover handlers active only if not mobile
  const onMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };
  const onMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

  // On mobile, toggle active state on tap/click
  const onTap = () => {
    if (isMobile) {
      setIsActive((prev) => !prev);
    }
  };

  // Determine final transform state - active on either hover or mobile tap
  const transform =
    isHovered || (isMobile && isActive)
      ? "translate(-50%,0%) rotateX(40deg) scale(0.8)"
      : "translate(-50%,0%) rotateX(0deg) scale(1)";

  return (
    <div
      className={cn(
        "relative group/pin z-50 touch-action-manipulation cursor-pointer"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onTap}
      onTouchStart={onTap}
      tabIndex={0}
      role="button"
      aria-pressed={isHovered || isActive}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{ transform }}
          className={cn(
            "absolute left-1/2 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black/[.55] border transition duration-700 overflow-hidden",
            isHovered || (isMobile && isActive)
              ? "border-white/[0.2]"
              : "border-white/[0.1]",
            className
          )}
        >
          <GlowingWrapper className="p-3 h-full bg-black/[.55]">
            <div className="relative z-50 w-full h-full">{children}</div>
          </GlowingWrapper>
        </div>
      </div>

      <PinPerspective
        href={href}
        containerClassName={containerClassName}
        title={title}
        isFocused={isHovered || (isMobile && isActive)}
      />
    </div>
  );
};

export const PinPerspective = ({
  href,
  title,
  containerClassName,
  isFocused = false,
}: {
  title?: string;
  href?: string;
  containerClassName?: string;
  isFocused?: boolean;
}) => {
  return (
    <motion.div
      className={cn(
        "pointer-events-none w-full h-full flex items-center justify-center transition-opacity duration-500 z-[60]",
        isFocused ? "opacity-100 pointer-events-auto" : "opacity-0"
      )}
      aria-hidden={!isFocused}
    >
      <div className="w-full h-full -mt-7 flex-none inset-0 relative">
        <div className="absolute -top-10 inset-x-0 flex justify-center">
          <div className="w-[10rem] h-[10rem] absolute bottom-full translate-y-1/2">
            <div className="relative w-3/4 h-3/4 mx-auto bottom-0 mt-10">
              <Image
                alt={title as string}
                src={href as string}
                fill
                style={{ objectFit: "cover" }}
                className={cn("opacity-100 z-[100]", containerClassName)}
              />
            </div>
          </div>
        </div>
        {/* animations omitted here for brevity */}
      </div>
    </motion.div>
  );
};
