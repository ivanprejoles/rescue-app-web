import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapToggleStore } from "@/hooks/use-mapToggleStore";
import { capitalize } from "@/lib/utils";
import { legendMarker } from "@/lib/constants"; // Only import the unified legendMarker
import { GradientWrapper } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingDock } from "@/components/ui/floating-dock";

const popupVariants = {
  hidden: { opacity: 0, x: -24, pointerEvents: "none" },
  visible: {
    opacity: 1,
    x: 0,
    pointerEvents: "auto",
    transition: { type: "spring" as const, stiffness: 400, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { type: "spring" as const, stiffness: 400, damping: 24 },
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

  const floatingDockItems = legendMarker.map((layer) => ({
    title: layer.label,
    icon: (
      <layer.svgIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    onClick: () => toggleLayer(layer.key),
    active: isLayerActive(layer.key),
  }));

  return (
    <div className="inline-block absolute bottom-7 left-19 z-[1000]">
      <GradientWrapper>
        <Button
          onClick={() => setOpen((prev) => !prev)}
          className="shadow-lg hover:shadow-xl transition-shadow rounded-full cursor-pointer"
          title="Toggle Markers"
          size="icon"
          variant="outline"
        >
          <MapPin size={20} />
        </Button>
      </GradientWrapper>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-full top-1/2 bg-black -translate-y-1/2 ml-2 flex rounded-xl shadow-lg p-1"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={popupVariants}
          >
            <GlowingWrapper>
              <Card className="py-0 rounded-[22px] border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <CardContent className="flex w-auto px-0">
                  <FloatingDock items={floatingDockItems} />
                </CardContent>
              </Card>
            </GlowingWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
