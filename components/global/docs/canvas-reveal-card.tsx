import { Card } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import SimpleCard from "@/components/ui/simple-card";
import React from "react";

const features = [
  {
    icon: "/simple-card-svg/realtime.svg",
    title: "Real-time Location Tracking",
    description:
      "Precise GPS tracking to locate people in need during emergencies",
    containerClassName: "bg-emerald-900",
  },
  {
    icon: "/simple-card-svg/fast.svg",
    title: "Instant Emergency Reporting",
    description:
      "Quick and easy emergency reporting with photo/video attachments",
    containerClassName: "bg-black",
  },
  {
    icon: "/simple-card-svg/user.svg",
    title: "Coordinated Response",
    description:
      "Efficient coordination between emergency responders and affected individuals",
    containerClassName: "bg-purple-500",
  },
  {
    icon: "/simple-card-svg/shield.svg",
    title: "Verified Response Teams",
    description: "All rescue teams are verified and trained professionals",
    containerClassName: "bg-sky-600",
  },
];

// WIP:
// use aceternity overlay card to show animation
// showing globe by hover and another video

const CanvasRevealCard = () => {
  return (
    <>
      {/* <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Emergency Response Features
      </h2> */}
      {/* gap-x-24 gap-y-20 lg:gap-x-[76px] lg:gap-y-14 md:gap-x-16 md:gap-y-12 sm:gap-y-8 */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <GlowingWrapper key={index}>
            <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
              <GlowingWrapper>
                <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
                  <GlowingWrapper>
                    <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0 p-4">
                      <GlowingWrapper>
                        <Card className="overflow-hidden border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative py-0">
                          <SimpleCard
                            // bodyClassName="p-6"
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            containerClassName={feature.containerClassName}
                          />
                        </Card>
                      </GlowingWrapper>
                    </Card>
                  </GlowingWrapper>
                </Card>
              </GlowingWrapper>
            </Card>
          </GlowingWrapper>
        ))}
      </ul>
    </>
  );
};

export default CanvasRevealCard;
