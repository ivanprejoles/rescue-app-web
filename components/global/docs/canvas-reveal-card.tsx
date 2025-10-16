"use client";

import { Card } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import SimpleCard from "@/components/ui/simple-card";

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

const CanvasRevealCard = () => {
  return (
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
  );
};

export default CanvasRevealCard;
