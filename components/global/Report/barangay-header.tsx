import React from "react";
import { MapPin, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { BarangayReport } from "@/lib/types";
import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <CardHeader
      // asChild
      className="cursor-pointer select-none"
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
          <div>
            <h3 className="text-xl font-bold">{barangay.name}</h3>
            {/* <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-2">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{barangay.captain}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{barangay.residents.toLocaleString()} residents</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{barangay.reports.length} reports</span>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant={barangay.reports.length > 0 ? "default" : "secondary"}
            className="px-4 py-2 rounded-full text-sm font-semibold"
          >
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>
                {barangay.reports.length}{" "}
                {barangay.reports.length === 1 ? "Report" : "Reports"}
              </span>
            </div>
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default BarangayHeader;
