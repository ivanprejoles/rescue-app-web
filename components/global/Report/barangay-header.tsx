import React from "react";
import { MapPin, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { BarangayReport } from "@/lib/types";
import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlowingWrapper } from "@/components/ui/glowing-effect";

interface BarangayHeaderProps {
  barangay: BarangayReport;
  isExpanded: boolean;
  onToggle: () => void;
}

const BarangayHeader: React.FC<BarangayHeaderProps> = ({
  barangay,
  isExpanded,
  onToggle,
}) => {
  return (
    <GlowingWrapper>
      <CardHeader
        // asChild
        className="cursor-pointer select-none p-0 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative gap-0 rounded-md"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center justify-between hover:bg-muted px-6 py-4 rounded-md transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-md md:text-xl font-bold">{barangay.name}</h3>
              <Badge
                variant={barangay.reports.length > 0 ? "blue" : "secondary"}
                className="px-2 py-1 rounded-full text-sm font-semibold"
              >
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span className=" text-md">
                    {barangay.reports.length}{" "}
                    {barangay.reports.length === 1 ? "Report" : "Reports"}
                  </span>
                </div>
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
    </GlowingWrapper>
  );
};

export default BarangayHeader;
