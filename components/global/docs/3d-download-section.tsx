"use client";

import { CheckCircle, Clock, Download, Smartphone } from "lucide-react";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { useState } from "react";

const DownloadSection = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <GlowingWrapper>
      <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
        <GlowingWrapper>
          <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
            <GlowingWrapper>
              <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
                <GlowingWrapper>
                  <Card
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="glass-effect p-3 md:p-12 text-center overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative"
                  >
                    <AnimatePresence>
                      {hovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full w-full absolute inset-0"
                        >
                          <CanvasRevealEffect
                            animationSpeed={5}
                            containerClassName="bg-transparent"
                            colors={[
                              [59, 130, 246],
                              [139, 92, 246],
                            ]}
                            opacities={[
                              0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1,
                            ]}
                            dotSize={2}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />

                    <Smartphone className="h-8 w-8 md:h-16 md:w-16 mx-auto mb-6 text-white" />
                    <h2 className="text-xl md:text-4xl font-bold mb-4 z-20 text-white">
                      Download our Mobile App
                    </h2>
                    <p className="text-sm md:text-xl text-gray-300 z-20 mb-4 md:mb-8 max-w-2xl mx-auto">
                      Get real-time weather alerts, emergency reporting, and
                      instant access to rescue services on your mobile device.
                    </p>
                    <div className="flex flex-col z-20 sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <Button
                        size="lg"
                        className="glass-effect text-white hover:bg-green-500/20 border border-green-500/30 flex-1 cursor-pointer"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download for Android
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 glass-effect flex-1 cursor-pointer"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download for iOS
                      </Button>
                    </div>
                    <div className="flex z-20 items-center justify-center gap-6 mt-8 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="md:text-md text-xs">
                          Version 1.0.0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="md:text-md text-xs">
                          Updated January 15, 2024
                        </span>
                      </div>
                    </div>
                  </Card>
                </GlowingWrapper>
              </Card>
            </GlowingWrapper>
          </Card>
        </GlowingWrapper>
      </Card>
    </GlowingWrapper>
  );
};

export default DownloadSection;
