import React from "react";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const variants = {
    default: "border border-gray-200",
  };

  return (
    <div
      onClick={onClick}
      role="button"
      className={`group/contact flex flex-col items-center gap-1 bg-white dark:bg-muted rounded-lg px-2 py-1 cursor-pointer shadow-sm ${className} ${variants.default}`}
    >
      <div className="flex flex-row gap-2 w-full">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="group-hover/contact:underline text-foreground ml-auto w-full text-center line-clamp-1 cursor-default cursor-pointer">
              {value}
            </span>
          </TooltipTrigger>

          <TooltipContent side="top" align="center" className="max-w-xs">
            <pre className="whitespace-pre-wrap">{value}</pre>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
