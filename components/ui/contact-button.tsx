import React from "react";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlowingWrapper } from "./glowing-effect";
import { Card } from "./card";

interface ContactButtonProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick?: () => void;
  className?: string;
  iconColor?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  icon: Icon,
  label,
  value,
  onClick,
  className = "",
  iconColor = "text-muted-foreground",
}) => {
  return (
    <GlowingWrapper>
      <Card
        onClick={onClick}
        role="button"
        className={`group/contact border-0.75 bg-transparent dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 p-3 flex flex-col items-center gap-1 rounded-lg px-2 py-1 cursor-pointer shadow-sm ${className}`}
      >
        <div className="flex flex-row gap-2 w-full">
          <div className="w-fit rounded-md border border-gray-600 p-1">
            <Icon className={`h-4 w-4 border-gray-600 ${iconColor}`} />
          </div>
          <span className="text-md text-muted-foreground">{label}</span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="group-hover/contact:underline text-foreground ml-auto w-full text-center line-clamp-1 cursor-pointer">
                {value}
              </span>
            </TooltipTrigger>

            <TooltipContent side="top" align="center" className="max-w-xs">
              <pre className="whitespace-pre-wrap">{value}</pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Card>
    </GlowingWrapper>
  );
};
