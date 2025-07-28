import React, { useState } from "react";
import {
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Announcement } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        icon: CheckCircle,
        bgColor: "bg-green-100 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
        badgeVariant: "default" as const,
        label: "Active",
      };
    case "draft":
      return {
        icon: AlertTriangle,
        bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        badgeVariant: "secondary" as const,
        label: "Draft",
      };
    case "urgent":
      return {
        icon: AlertCircle,
        bgColor: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        badgeVariant: "destructive" as const,
        label: "Urgent",
      };
    default:
      return {
        icon: Info,
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        badgeVariant: "outline" as const,
        label: "Info",
      };
  }
};

const isToday = (dateString: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
};

export default function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getStatusConfig(announcement.status);
  const IconComponent = config.icon;

  // Truncate description for preview
  const previewLength = 110;
  const shouldTruncate = announcement.description.length > previewLength;
  const previewText = shouldTruncate
    ? announcement.description.substring(0, previewLength) + "..."
    : announcement.description;

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`${config.bgColor} p-2 rounded-lg`}>
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2 flex-wrap">
                <h4 className="text-lg font-semibold truncate">
                  {announcement.title}
                </h4>
                <Badge variant={config.badgeVariant}>{config.label}</Badge>
                {isToday(announcement.date) && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    New
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatReadableDate(announcement.date)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(announcement)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(announcement.id)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="space-y-3">
            {/* Preview text */}
            <p className="text-muted-foreground leading-relaxed">
              {isExpanded ? announcement.description : previewText}
            </p>

            {/* Collapsible trigger - only show if content is truncated */}
            {shouldTruncate && (
              <>
                <Separator />
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center hover:bg-muted/50"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show More
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </>
            )}
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
