import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import Image from "next/image";

interface CardProps {
  children?: ReactNode;
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
    // sm:px-6 md:px-8  px-4
    <div className="relative mx-auto w-full rounded-lg border-zinc-300 dark:border-zinc-800  dark:bg-[#09090B] shadow-sm">
      {/* Top line */}
      {/* <div className="absolute left-0 top-4 -z-0 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:top-6 md:top-8" /> */}
      {/* Bottom line */}
      {/* <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-400 dark:bg-zinc-700 sm:bottom-6 md:bottom-8" /> */}
      {/* border-x border-zinc-400 dark:border-zinc-700 */}
      <div className="relative w-full ">
        {/* <Ellipses /> */}
        <div className="relative z-20 mx-auto">
          {/* If children passed, render them; else render default CardBody */}
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
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="overflow-hidden group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 h-[10rem] relative"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center translate-y-1">
          {/* {icon} */}
          <Image src={icon} alt="Icon description" width={66} height={65} />
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black   font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        <p className="text-sm font-light opacity-0 group-hover/canvas-card:opacity-100 z-10 leading-snug tracking-snugger text-gray-500 text-left md:leading-tight group-hover/canvas-card:text-gray-500 group-hover/canvas-card:-translate-y-2 transition duration-200 ">
          {description}
        </p>
      </div>
    </div>
  );
};
