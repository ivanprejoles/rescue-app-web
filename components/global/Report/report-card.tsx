"use client";

import type React from "react";
import { User, Phone, MapPin, Calendar, Edit } from "lucide-react";
import type { Report } from "@/lib/types";
import { getStatusColor, openGoogleMaps, callNumber } from "@/lib/utils";
import { getStatusIcon } from "./icon-helper";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/ui/contact-button";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stats";
import { GradientWrapper } from "@/components/ui/background-gradient";

interface ReportCardProps {
  report: Report;
  onStatusUpdate: (report: Report) => void;
  onDelete: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onStatusUpdate,
  onDelete,
}) => {
  return (
    // <div className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow transition-all">
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 transition-all px-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-bold text-foreground">
              {report.title}
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusColor(report.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(report.status)}
                <span className="capitalize">
                  {report.status.replace("-", " ")}
                </span>
              </div>
            </Badge>
          </div>
        </div>

        {/* Report Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            icon={User}
            label="Reported by"
            value={report.reportedBy as string}
            iconColor="text-blue-400"
          />
          <StatCard
            icon={Calendar}
            label="Date Reported"
            value={formatDate(report.dateReported as string)}
            iconColor="text-red-400"
          />
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ContactButton
            icon={Phone}
            label="Contact Number"
            value={report.contactNumber as string}
            onClick={() => callNumber(report.contactNumber!)}
            iconColor="text-green-400"
          />

          <ContactButton
            icon={MapPin}
            label="Location"
            value={report.title}
            onClick={() =>
              openGoogleMaps({ lat: report.latitude, lng: report.longitude })
            }
            iconColor="text-blue-400"
          />
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-border">
          <div className="flex gap-2">
            <GradientWrapper>
              <Button
                size="sm"
                variant="outline"
                className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                onClick={() => onStatusUpdate(report)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Status
              </Button>
            </GradientWrapper>
            {/* {report.status === "Resolved" && ( */}
            <GradientWrapper>
              <Button
                size="sm"
                variant="outline"
                className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer text-red-600 hover:text-red-700"
                onClick={() => onDelete(report)}
              >
                <Edit className="h-4 w-4 mr-2 text-red-600 hover:text-red-700" />
                Delete
              </Button>
            </GradientWrapper>
            {/* )} */}
          </div>
        </div>
      </Card>
    </GlowingWrapper>
    // {/* Header Row: Title and Badges */}
    // </div>
  );
};

export default ReportCard;
