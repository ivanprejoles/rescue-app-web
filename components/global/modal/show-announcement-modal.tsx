/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ReadOnlyAnnouncementCard from "../Announcement/readonly-announcement-card";
import { getAnnouncementsClient } from "@/lib/client-fetchers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function ShowAnnouncementModal() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const {
    data: announcements = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncementsClient,
  });

  useEffect(() => {
    const channel = supabase
      .channel("announcements-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        (payload: any) => {
          const isInsert = payload.eventType === "INSERT";
          const isUpdate = payload.eventType === "UPDATE";

          if (isInsert || isUpdate) {
            const announcement = payload.new;

            const message = isInsert
              ? `New announcement created: ${announcement.title}`
              : `Announcement updated: ${announcement.title}`;

            const createdAt = new Date(
              announcement.date || Date.now()
            ).toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            toast(message, {
              description: createdAt,
            });
          }

          // Optional: invalidate query to refresh list
          queryClient.invalidateQueries({ queryKey: ["announcements"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  function groupAnnouncements(announcements: any[]) {
    const today = new Date();
    const dayMs = 1000 * 60 * 60 * 24;

    // Normalize today's date to YYYY-MM-DD only
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const groups: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      "This Month": [],
      "> 1 Month": [],
    };

    announcements.forEach((a) => {
      const fullDate = new Date(a.date);
      const dateOnly = new Date(
        fullDate.getFullYear(),
        fullDate.getMonth(),
        fullDate.getDate()
      );
      const diffDays = Math.floor(
        (todayDateOnly.getTime() - dateOnly.getTime()) / dayMs
      );

      if (diffDays === 0) groups["Today"].push(a);
      else if (diffDays === 1) groups["Yesterday"].push(a);
      else if (diffDays <= 7) groups["This Week"].push(a);
      else if (
        fullDate.getMonth() === today.getMonth() &&
        fullDate.getFullYear() === today.getFullYear()
      ) {
        groups["This Month"].push(a);
      } else {
        groups["> 1 Month"].push(a);
      }
    });

    return groups;
  }

  const grouped = groupAnnouncements(announcements);

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
            >
              <Bell className="h-5 w-5 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />

              {/* 🔔 Red dot shown only if Today, Yesterday, or This Week have announcements */}
              {(grouped["Today"].length > 0 ||
                grouped["Yesterday"].length > 0 ||
                grouped["This Week"].length > 0) && (
                <Badge className="absolute top-0 -right-0 h-3 w-3 p-0 bg-red-500" />
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Announcements</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle>Latest Announcements</DialogTitle>
        </DialogHeader>

        <div className="rounded-md space-y-4">
          {isPending && <p>Loading announcements...</p>}

          {isError && <p className="text-red-500">Error: {error.message}</p>}

          {!isPending && !isError && announcements.length === 0 && (
            <Card className="bg-[#2A2C40]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No announcements found
                </h3>
              </CardContent>
            </Card>
          )}

          {!isPending &&
            !isError &&
            Object.entries(grouped).map(([label, list]) =>
              list.length > 0 ? (
                <div key={label} className="space-y-3">
                  <Separator className="bg-gray-500" />
                  <Badge variant="blue" className=" text-muted-foreground px-2">
                    {label}
                  </Badge>

                  {list.map((announcement: any, index: number) => (
                    <ReadOnlyAnnouncementCard
                      key={announcement.id ?? index}
                      announcement={announcement}
                    />
                  ))}
                </div>
              ) : null
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
