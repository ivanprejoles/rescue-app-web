import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "./card";
import { GlowingWrapper } from "./glowing-effect";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-muted-foreground",
}) => {
  return (
    <GlowingWrapper>
      <Card
        className={`border-0.75 bg-transparent dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 p-3 flex flex-col items-center gap-1 rounded-lg px-2 py-1 shadow-sm`}
      >
        <div className="flex flex-row gap-2 w-full">
          <div className="w-fit rounded-md border border-gray-600 p-1">
            <Icon className={`h-4 w-4 border-gray-600 ${iconColor}`} />
          </div>
          <span className="text-md text-muted-foreground">{label}</span>{" "}
        </div>
        <span className="text-foreground ml-auto w-full text-center line-clamp-1">
          {value}
        </span>
      </Card>
    </GlowingWrapper>
  );
};
