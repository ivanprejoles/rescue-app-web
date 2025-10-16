import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { insertedMarker } from "@/lib/constants";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { MapPinPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingMarker } from "@/components/ui/floating-marker";

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

  const floatingMarkerItems = insertedMarker.map((marker) => ({
    title: marker.title,
    icon: (
      <marker.svgIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    onClick: () => {
      onSelect(marker.title);
      closeMenu();
    },
  }));

  return (
    <div className="inline-block absolute bottom-6 left-6 z-[1000]">
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-0 bottom-full flex flex-col items-center gap-3 rounded-xl bg-transparent shadow-lg p-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* {insertedMarker.map((item) => (
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
            ))} */}

            <Card className="py-0 rounded-[22px] border-0.75 bg-transparent dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
              <CardContent className="flex flex-col gap-2 w-10 justify-center px-0">
                <FloatingMarker items={floatingMarkerItems} open={open} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-12 w-auto bg-transparent items-center justify-center">
        <GradientWrapper>
          <Button
            onClick={() => setOpen((prev) => !prev)}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-full cursor-pointer"
            title="Add New Marker"
            size="icon"
            variant="outline"
          >
            <MapPinPlus size={20} />
          </Button>
        </GradientWrapper>
      </div>
    </div>
  );
}
