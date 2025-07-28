import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  gradient = false,
}) => {
  const baseClasses =
    "bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300";
  const hoverClasses = hover
    ? "hover:shadow-xl hover:border-gray-200 hover:-translate-y-1"
    : "";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-white to-gray-50"
    : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
    >
      {children}
    </div>
  );
};
