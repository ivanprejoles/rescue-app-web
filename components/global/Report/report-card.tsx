"use client";

import type React from "react";
import { User, Phone, MapPin, Calendar, Save, Trash2 } from "lucide-react";
import type { Report } from "@/lib/types";
import {
  getStatusColor,
  getPriorityColor,
  getCategoryColor,
  openGoogleMaps,
  callNumber,
} from "@/lib/utils";
import { getStatusIcon, getPriorityIcon, getCategoryIcon } from "./icon-helper";
import { formatDate } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/ui/contact-button";

interface ReportCardProps {
  report: Report;
  onStatusUpdate: (reportId: string, newStatus: string) => void;
  onDelete: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onStatusUpdate,
  onDelete,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow transition-all">
      {/* Header Row: Title and Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-lg font-bold text-foreground">{report.title}</h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={getPriorityColor(report.priority)}
          >
            <div className="flex items-center gap-1">
              {getPriorityIcon(report.priority)}
              <span className="uppercase">{report.priority}</span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className={getCategoryColor(report.category)}
          >
            <div className="flex items-center gap-1">
              {getCategoryIcon(report.category)}
              <span>{report.category}</span>
            </div>
          </Badge>
          <Badge variant="outline" className={getStatusColor(report.status)}>
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
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Reported by</span>
            <span className="font-semibold text-foreground text-sm">
              {report.reportedBy}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Date Reported</span>
            <span className="font-semibold text-foreground text-sm">
              {formatDate(report.dateReported)}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ContactButton
          icon={Phone}
          label="Contact Number"
          value={report.contactNumber}
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
          iconColor="text-red-400"
        />
      </div>

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-border">
        <Select
          value={report.status}
          onValueChange={(value) => onStatusUpdate(report.id, value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 flex-1 sm:flex-none"
            onClick={() =>
              console.log(`Saving changes for report ${report.id}`)
            }
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          {report.status === "Resolved" && (
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 flex-1 sm:flex-none"
              onClick={() => onDelete(report.id)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
