import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapToggleStore } from "@/hooks/use-mapToggleStore";
import { capitalize, cn } from "@/lib/utils";
import { legendMarker } from "@/lib/constants"; // Only import the unified legendMarker

const popupVariants = {
  hidden: { opacity: 0, x: -24, pointerEvents: "none" },
  visible: {
    opacity: 1,
    x: 0,
    pointerEvents: "auto",
    transition: { type: "spring", stiffness: 400, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { type: "spring", stiffness: 400, damping: 24 },
  },
};

export default function LegendPopover() {
  const [open, setOpen] = React.useState(false);
  const store = useMapToggleStore();

  // Checks if the toggle for a given key is active in the store
  const isLayerActive = (key: string) => {
    const toggleKey = `show${capitalize(key)}` as keyof typeof store;
    return store[toggleKey];
  };

  // Toggles the visibility of the layer in the store
  const toggleLayer = (key: string) => {
    store.toggleLayer(key);
  };

  return (
    <div className="inline-block absolute top-6 left-6 z-[1000]">
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        animate={
          open
            ? { scale: 1.05, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }
            : { scale: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }
        }
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center px-2 py-1 rounded-lg gap-2 bg-white shadow cursor-pointer hover:bg-white hover:shadow"
      >
        <span className="text-2xl">🗺️</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex gap-2 bg-white rounded-xl shadow-lg p-2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={popupVariants}
          >
            {legendMarker.map((layer) => {
              const active = isLayerActive(layer.key);
              return (
                <motion.div
                  key={layer.key}
                  onClick={() => toggleLayer(layer.key)}
                  className={cn(
                    "flex flex-col items-center px-2 py-1 rounded-lg cursor-pointer transition-colors",
                    active
                      ? "bg-purple-100 text-purple-700 font-bold"
                      : "hover:bg-gray-100"
                  )}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl">{layer.icon}</span>
                  <span className="text-xs mt-1">{layer.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
