import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick?: () => void;
  variant?: "default" | "clickable" | "highlight";
  className?: string;
  iconColor?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  onClick,
  variant = "default",
  className = "",
  iconColor = "text-muted-foreground",
}) => {
  const baseClasses =
    "flex flex-col items-center gap-1 items-center px-2 py-1 rounded-xl border transition-all duration-200";

  const variants = {
    default: "bg-gray-50 border-gray-200",
    clickable:
      "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer hover:shadow-md transform hover:scale-105",
    highlight: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <Icon size={18} className="text-gray-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div> */}
      <div className="flex flex-row gap-2 w-full">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="group-hover/contact:underline text-foreground ml-auto w-full text-center line-clamp-1">
        {value}
      </span>
    </Component>
  );
};
