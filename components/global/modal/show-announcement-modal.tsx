import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ReadOnlyAnnouncementCard from "../Announcement/readonly-announcement-card";

import { getAnnouncementsClient } from "@/lib/client-fetchers";

export default function ShowAnnouncementModal() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements on component mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnnouncementsClient();
        setAnnouncements(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
              <Badge className="absolute top-0 -right-0 h-3 w-3 flex items-center justify-center p-0 text-xs bg-red-500" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Announcements</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader className="h-auto">
          <DialogTitle>Latest Announcements</DialogTitle>
        </DialogHeader>
        <div className="flex-1 rounded-md overflow-hidden space-y-4">
          {loading && <p>Loading announcements...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && announcements.length === 0 && (
            <Card className="bg-[#2A2C40]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No announcements found
                </h3>
              </CardContent>
            </Card>
          )}
          {!loading &&
            !error &&
            announcements.map((announcement, index) => (
              <ReadOnlyAnnouncementCard
                key={index}
                announcement={announcement}
              />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
