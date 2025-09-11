/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

export const FloatingMarker = ({
  items,
  mobileClassName,
  open,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
  open: boolean;
}) => {
  return (
    <>
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        isOpen={open}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  isOpen,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  className?: string;
  isOpen: boolean;
}) => {
  const [open, setOpen] = useState(isOpen);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("relative block", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <div
                  onClick={item.onClick}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex flex-col items-center cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900">
                    <div className="h-4 w-4">{item.icon}</div>
                  </div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, y: "-50%" }}
                        animate={{ opacity: 1, x: 0, y: "-50%" }}
                        exit={{ opacity: 0, x: 10, y: "-50%" }}
                        className="absolute left-full top-1/2 ml-2 w-max rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
                        style={{ transform: "translateY(-50%)" }}
                      >
                        {item.title}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
