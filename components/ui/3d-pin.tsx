"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowingWrapper } from "./glowing-effect";

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
  const [transform, setTransform] = useState("translate(-50%,0) rotateX(0deg)");

  const onMouseEnter = () => {
    setTransform("translate(-50%,0%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,0%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn("relative group/pin z-50  cursor-pointer")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem]  -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className={cn(
            "absolute left-1/2  top-1/2  flex justify-start items-start  rounded-2xl  shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black/[.55] border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden",
            className
          )}
        >
          <GlowingWrapper className="p-3 h-full bg-black/[.55]">
            <div className={cn(" relative z-50 w-full h-full")}>{children}</div>
          </GlowingWrapper>
        </div>
      </div>
      <PinPerspective
        href={href}
        containerClassName={containerClassName}
        title={title}
      />
    </div>
  );
};

export const PinPerspective = ({
  href,
  title,
  containerClassName,
}: {
  title?: string;
  href?: string;
  containerClassName?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-full h-full  flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className=" w-full h-full -mt-7 flex-none  inset-0">
        <div className="absolute -top-10 inset-x-0  flex justify-center">
          <div className="w-[10rem] h-[10rem] absolute bottom-full translate-y-1/2">
            <img
              alt={title}
              src={href}
              className={cn(
                "w-full h-full  opacity-100 z-[100]",
                containerClassName
              )}
            />
          </div>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 -translate-y-1/2  ml-[0.09375rem] mt-4 -translate-x-1/2 "
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-full translate-y-full  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/1)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute left-1/2 top-full translate-y-full  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/1)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4,
              }}
              className="absolute left-1/2 top-full translate-y-full  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/1)]"
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className="absolute right-1/2 top-1/2 bg-gradient-to-b from-transparent to-cyan-500 -translate-y-1/2 w-px h-20 group-hover/pin:h-40 blur-[2px]" />
          <motion.div className="absolute right-1/2 top-1/2 bg-gradient-to-b from-transparent to-cyan-500 -translate-y-1/2 w-px h-20 group-hover/pin:h-40  " />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] top-1/2 bg-cyan-600 translate-y-1/2 w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] top-1/2 bg-cyan-300 translate-y-1/2 w-[2px] h-[2px] rounded-full z-40 " />
        </>
      </div>
    </motion.div>
  );
};
