"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordPullUpProps {
  words?: string;
  className?: string;
  delay?: number;
  stagger?: number;
  wrapperFramerProps?: any;
  framerProps?: any;
}

export default function WordPullUp({
  words = "Loading...",
  className,
  delay = 0, // default animation delay
  stagger = 0.25, // default stagger between words
  wrapperFramerProps,
  framerProps,
}: WordPullUpProps) {
  const wordSplit = words.split(" ");

  const defaultWrapperProps = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
      },
    },
  };

  const defaultFramerProps = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.h1
      variants={wrapperFramerProps || defaultWrapperProps}
      initial="hidden"
      animate="show"
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className
      )}
    >
      {wordSplit.map((word, i) => (
        <motion.span
          key={i}
          variants={framerProps || defaultFramerProps}
          className="inline-block pr-[8px]"
        >
          {word === "" ? "\u00A0" : word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
