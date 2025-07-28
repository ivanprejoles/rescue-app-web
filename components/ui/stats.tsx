import React from "react";
import { LucideIcon } from "lucide-react";

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
  const variants = {
    default: "border border-gray-200",
  };

  return (
    <div
      className={`flex flex-col items-center gap-1 bg-white dark:bg-muted rounded-lg px-2 py-1 shadow-sm ${variants.default}`}
    >
      <div className="flex flex-row gap-2 w-full">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-foreground ml-auto w-full text-center line-clamp-1">
        {value}
      </span>
    </div>
  );
};
