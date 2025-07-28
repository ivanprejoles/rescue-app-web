import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { insertedMarker } from "@/lib/constants";

export default function MarkerMaker({
  onSelect,
  onExit,
}: {
  onSelect: (type: string) => void;
  onExit?: () => void;
}) {
  const [open, setOpen] = useState(false);

  // Close and notify onExit when closing menu
  const closeMenu = () => {
    setOpen(false);
    if (onExit) onExit();
  };

  return (
    <div className="inline-block absolute bottom-6 left-6 z-[1000]">
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-0 bottom-full mb-3 flex flex-col items-center gap-3 rounded-xl bg-white shadow-lg p-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {insertedMarker.map((item) => (
              <motion.div
                key={item.title}
                onClick={() => {
                  onSelect(item.title);
                  closeMenu();
                }}
                className={`flex flex-col items-center cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-gray-100`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="mt-1 text-xs">{item.title}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md"
        title="Select marker type"
      >
        🗺️{/* Always show this default icon */}
      </button>
    </div>
  );
}
