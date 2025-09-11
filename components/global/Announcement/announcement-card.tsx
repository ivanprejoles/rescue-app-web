import React, { useState } from "react";
import {
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { Announcement } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "information":
      return {
        icon: Info,
        bgColor: "bg-gradient-to-br bg-blue-500 to-black",
        iconColor: "text-white",
        badgeVariant: "info" as const,
        label: "Info",
      };
    case "urgent":
      return {
        icon: AlertCircle,
        bgColor: "bg-gradient-to-br from-yellow-500 to-black",
        iconColor: "text-white",
        badgeVariant: "secondary" as const,
        label: "Urgent",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        bgColor: "bg-gradient-to-br bg-red-500 to-black",
        iconColor: "text-white",
        badgeVariant: "destructive" as const,
        label: "Warning",
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
  const IconComponent = config?.icon;

  // Truncate description for preview
  const previewLength = 110;
  const shouldTruncate = announcement.description.length > previewLength;
  const previewText = shouldTruncate
    ? announcement.description.substring(0, previewLength) + "..."
    : announcement.description;

  return (
    <GlowingWrapper>
      <Card className="transition-all duration-200 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`${config?.bgColor} p-2 rounded-lg`}>
                <IconComponent className={`h-5 w-5 ${config?.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2 flex-wrap">
                  <h4 className="text-lg font-semibold truncate">
                    {announcement.title}
                  </h4>
                  <Badge variant={config?.badgeVariant}>{config?.label}</Badge>
                  {isToday(announcement.date) && (
                    <Badge variant="blue">New</Badge>
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
              <GradientWrapper>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(announcement)}
                  className="text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-full"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </GradientWrapper>
              <GradientWrapper>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(announcement)}
                  className="text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </GradientWrapper>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {isExpanded ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {announcement.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {previewText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsible trigger - only show if content is truncated */}
              {shouldTruncate && (
                <CollapsibleTrigger asChild>
                  <GradientWrapper>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                      onClick={() => setIsExpanded((prev) => !prev)}
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
                  </GradientWrapper>
                </CollapsibleTrigger>
              )}
            </div>
          </Collapsible>
        </CardContent>
      </Card>
    </GlowingWrapper>
  );
}
