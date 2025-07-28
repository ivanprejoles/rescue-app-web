"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  phone: string;
  location: { lat: number; lng: number; address: string };
  urgency: string;
  description: string;
  peopleCount: number;
  injuries: string;
  shelter: string;
  supplies: string;
  status: string;
  timestamp: Date;
  assignedTo: string | null;
}

interface ReportDetailsModalProps {
  report: Report;
  onClose: () => void;
  onStatusChange: (reportId: string, newStatus: string) => void;
}

export function ReportDetailsModal({
  report,
  onClose,
  onStatusChange,
}: ReportDetailsModalProps) {
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState(report.assignedTo || "");

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "verified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(report.id, newStatus);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Report Details - {report.id}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the emergency report and available
            actions
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Report Information */}
          <div className="space-y-6">
            {/* Status and Urgency */}
            <div className="flex gap-2">
              <Badge className={getUrgencyColor(report.urgency)}>
                {report.urgency.toUpperCase()} URGENCY
              </Badge>
              <Badge className={getStatusColor(report.status)}>
                {report.status.toUpperCase()}
              </Badge>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Name
                  </Label>
                  <p className="font-medium">{report.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Phone
                  </Label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {report.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span>{report.location.address}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Coordinates: {report.location.lat.toFixed(6)},{" "}
                  {report.location.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Situation Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Situation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    People Count
                  </Label>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {report.peopleCount} people
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Injuries
                  </Label>
                  <p className="font-medium capitalize">{report.injuries}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Shelter Status
                  </Label>
                  <p className="font-medium capitalize">{report.shelter}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Supplies Needed
                  </Label>
                  <p className="font-medium capitalize">{report.supplies}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {report.description}
              </p>
            </div>

            {/* Timestamp */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Timeline</h3>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                Reported: {report.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right Column - Actions and Management */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleStatusChange("verified")}
                  disabled={
                    report.status === "verified" || report.status === "resolved"
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Report
                </Button>
                <Button
                  onClick={() => handleStatusChange("resolved")}
                  disabled={report.status === "resolved"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Reporter
                </Button>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Assignment</h3>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign to Team/Personnel</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team or personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rescue-alpha">
                      Rescue Team Alpha
                    </SelectItem>
                    <SelectItem value="rescue-beta">
                      Rescue Team Beta
                    </SelectItem>
                    <SelectItem value="medical-team">
                      Medical Response Team
                    </SelectItem>
                    <SelectItem value="supply-team">
                      Supply Distribution Team
                    </SelectItem>
                    <SelectItem value="evacuation-team">
                      Evacuation Team
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Admin Notes</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Add notes or updates</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes, updates, or instructions..."
                  rows={4}
                />
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Export & Documentation</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Save Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
              <Button className="flex-1">Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
