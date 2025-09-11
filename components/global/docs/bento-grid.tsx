import { LightBeams } from "@/components/ui/lightbeam";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { PinContainer } from "@/components/ui/3d-pin";

const BentoGrid = () => {
  return (
    <div className="container relative z-10 lg:max-w-[960px] md:max-w-3xl max-w-xl">
      <h2 className="font-semibold tracking-tighter text-black md:text-7xl sm:text-5xl text-4xl">
        Unmatched features
      </h2>
      <p className="mt-4 leading-tight text-black tracking-tight lg:mt-5 sm:mt-3 md:text-lg">
        Huly is a platform that combines project, time, and knowledge management
        with real-time rescue features. It allows users and rescue teams to
        collaborate efficiently, track locations live, access nearest evacuation
        points, and view current weather updates—all in one place for improved
        safety and coordination.
      </p>
      <ul className="mt-10 layout-switcher gap-5 lg:mt-9 lg:gap-4 md:mt-6 sm:mt-5 items-center justify-center mx-auto">
        {/* Realtime map */}
        {/* here */}
        <li className="type-1 relative grid grid-cols-1 grid-rows-1 overflow-hidden rounded-xl bg-grey-2 bg-clip-padding ring-[6px] ring-white/40  order-2 ">
          {/* title description */}
          <div className="absolute bottom-0 z-10 col-span-full flex w-full items-end px-6 pb-6 lg:px-5 lg:pb-5 md:px-4 md:pb-4 sm:px-5 sm:pb-5 after:absolute after:bottom-0 after:left-0 after:z-0 after:h-[180%] after:w-full after:bg-[linear-gradient(180deg,rgba(9,10,12,0)_0%,#090A0C_40.76%)] after:blur-md">
            <p className="relative z-10 font-light leading-snug tracking-snugger text-white/65 md:leading-[1.2] sm:text-15">
              <span className="font-medium text-white">
                {"Live Location Tracking. "}
              </span>
              Provides up-to-date, real-time location sharing between users and
              rescuers, enabling accurate positioning and better coordination
              during rescue operations.
            </p>
          </div>
          {/* content */}
          <div className="relative col-span-full row-span-full bg-black">
            <LightBeams />
            <div className="absolute left-0 top-2 h-full w-full">
              <Globe className="absolute left-1/2 -translate-x-1/2 -top-10" />
            </div>
          </div>
        </li>

        {/* Messaging feature */}
        <li className="type-2 relative grid grid-cols-1 grid-rows-1 overflow-hidden rounded-xl bg-grey-2 bg-clip-padding ring-[6px] ring-white/40 order-1">
          {/* title description */}
          <div className="absolute bottom-0 z-10 col-span-full flex w-full items-end px-6 pb-6 lg:px-5 lg:pb-5 md:px-4 md:pb-4 sm:px-5 sm:pb-5 after:absolute after:bottom-0 after:left-0 after:z-0 after:h-[180%] after:w-full after:bg-[linear-gradient(180deg,rgba(9,10,12,0)_0%,#090A0C_40.76%)] after:blur-md">
            <p className="relative z-10 font-light leading-snug tracking-snugger text-white/65 md:leading-[1.2] sm:text-15 max-w-[436px] md:max-w-[344px]">
              <span className="font-medium text-white">{"Messaging. "}</span>
              Enables users to send messages and updates without requiring
              immediate replies.
            </p>
          </div>
          {/* content */}
          <div className="relative col-span-full row-span-full bg-black">
            <LightBeams variant="fire" />
            <div className="absolute left-0 top-0 w-full p-3">
              <SkeletonOne />
            </div>
          </div>
        </li>

        {/* Rescuer Reliability */}
        <li className="type-1 relative grid grid-cols-1 grid-rows-1 overflow-hidden rounded-xl bg-grey-2 bg-clip-padding ring-[6px] ring-white/40 order-3">
          {/* title description */}
          <div className="absolute bottom-0 z-10 col-span-full flex w-full items-end px-6 pb-6 lg:px-5 lg:pb-5 md:px-4 md:pb-4 sm:px-5 sm:pb-5 after:absolute after:bottom-0 after:left-0 after:z-0 after:h-[180%] after:w-full after:bg-[linear-gradient(180deg,rgba(9,10,12,0)_0%,#090A0C_40.76%)] after:blur-md">
            <p className="relative z-10 font-light leading-snug tracking-snugger text-white/65 md:leading-[1.2] sm:text-15">
              <span className="font-medium text-white">
                {"Trusted Rescuers. "}
              </span>
              Connects you to verified rescuers who respond promptly and provide
              effective support during emergencies.
            </p>
          </div>
          {/* content */}
          <div className="relative col-span-full row-span-full bg-black">
            <LightBeams variant="sunset" />
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 h-4/5 w-full p-4">
              <SkeletonFour />
            </div>
          </div>
        </li>

        {/* 4: Time-blocking */}
        <li className="type-2 relative grid grid-cols-1 grid-rows-1 overflow-hidden rounded-xl bg-grey-2 bg-clip-padding ring-[6px] ring-white/40 order-4">
          {/* title description */}
          <div className="absolute bottom-0 z-10 col-span-full flex w-full items-end px-6 pb-6 lg:px-5 lg:pb-5 md:px-4 md:pb-4 sm:px-5 sm:pb-5 after:absolute after:bottom-0 after:left-0 after:z-0 after:h-[180%] after:w-full after:bg-[linear-gradient(180deg,rgba(9,10,12,0)_0%,#090A0C_40.76%)] after:blur-md">
            <p className="relative z-10 font-light leading-snug tracking-snugger text-white/65 md:leading-[1.2] sm:text-15 max-w-[392px] lg:max-w-[348px]">
              <span className="font-medium text-white">{"Trusted Map. "}</span>
              Shows evacuation points, admin updates, user locations, and live
              directions.
            </p>
          </div>
          {/* content */}
          <div className="relative col-span-full row-span-full bg-black">
            <LightBeams variant="emerald" />
            <div className="absolute left-1/2 top-1/5 -translate-x-1/2">
              <div className="flex items-center justify-center h-5 w-8 bottom-0">
                <PinContainer
                  title="/ui.aceternity.com"
                  href="/images/google-map.png"
                  containerClassName="w-3/5 h-3/5 bottom-0 left-0 mx-auto right-0 absolute"
                >
                  <div className="flex basis-full flex-col p-1 tracking-tight text-slate-100/50 sm:basis-1/2 w-[15rem] h-[10rem] ">
                    <img
                      className="w-full h-3/4 opacity-85 mx-auto rounded-md"
                      src={"/images/map-neon.jpg"}
                      alt="guide"
                    />
                  </div>
                </PinContainer>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default BentoGrid;

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="text-xs text-neutral-300">
          Need rescue at 123 Sitio St. Flooding waist-high. Four people, one
          injured. Please send help ASAP.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className=" flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black"
      >
        <p className="text-xs text-neutral-300">
          Help is on the way. Stay safe and keep your phone on for updates.
        </p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 mr-auto bg-white dark:bg-black"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Calm and steady under pressure.
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Reliable
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Expert at precise, effective rescue.
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Skilled
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Cares deeply and supports others.
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Compassionate
        </p>
      </motion.div>
    </motion.div>
  );
};
