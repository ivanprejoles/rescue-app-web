"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Save,
  Eye,
  Edit3,
} from "lucide-react";

interface StoredMarkerType {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  additional_info?: {
    urgency?: string;
    [key: string]: any;
  };
}

interface MarkerPopupContentProps {
  marker: StoredMarkerType;
  onUpdate: (updatedMarker: StoredMarkerType) => void;
}

const urgencyOptions = [
  { value: "Low", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "High", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Critical", color: "bg-red-100 text-red-800 border-red-200" },
];

const statusIcons = {
  active: CheckCircle2,
  pending: Clock,
  inactive: X,
  default: AlertCircle,
};

export function MarkerPopupContent({
  marker,
  onUpdate,
}: MarkerPopupContentProps) {
  const [formData, setFormData] = useState(marker);
  const [activeTab, setActiveTab] = useState("view");

  function handleChange(field: keyof StoredMarkerType, value: any) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleAdditionalInfoChange(field: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        [field]: value,
      },
    }));
  }

  function handleSave() {
    onUpdate(formData);
    setActiveTab("view");
  }

  function handleCancel() {
    setFormData(marker);
    setActiveTab("view");
  }

  if (!marker) return null;

  const urgencyLevel = marker.additional_info?.urgency || "Low";
  const urgencyConfig =
    urgencyOptions.find((opt) => opt.value === urgencyLevel) ||
    urgencyOptions[0];

  const StatusIcon =
    statusIcons[marker.status?.toLowerCase() as keyof typeof statusIcons] ||
    statusIcons.default;

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold leading-none">
            {marker.name || "Unnamed Location"}
          </h3>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4 mt-4">
            {marker.description && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {marker.description}
                </p>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="capitalize">
                    {marker.status || "Unknown"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Priority
                </span>
                <Badge
                  className={`${urgencyConfig.color} hover:${urgencyConfig.color}`}
                  variant="outline"
                >
                  {urgencyLevel}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Location Name
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter location name"
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Input
                  id="status"
                  value={formData.status || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                  placeholder="Status"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.additional_info?.urgency || ""}
                  onValueChange={(val) =>
                    handleAdditionalInfoChange("urgency", val)
                  }
                >
                  <SelectTrigger id="urgency" className="h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    {urgencyOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              option.value === "Low"
                                ? "bg-green-500"
                                : option.value === "Medium"
                                ? "bg-yellow-500"
                                : option.value === "High"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          />
                          {option.value}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8 bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="h-8">
                <Save className="h-3 w-3 mr-1" />
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
