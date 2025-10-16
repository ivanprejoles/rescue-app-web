import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapEvacuationCenter, MapMarker } from "@/lib/types";
import dynamic from "next/dynamic";
import { useDialogStore } from "@/hooks/use-full-screen";

const LeafletMap = dynamic(
  () => import("@/components/global/docs/leaflet-map"),
  {
    ssr: false,
  }
);

interface Props {
  markers: MapMarker[];
  evacuationCenters: MapEvacuationCenter[];
}

export default function ClientFullScreen({
  markers,
  evacuationCenters,
}: Props) {
  const { setOpen, open } = useDialogStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <GradientWrapper>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setOpen(true)}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
          >
            <Eye className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </GradientWrapper>
      </DialogTrigger>
      <DialogContent className="w-full h-7/8 sm:max-w-7/8 flex flex-col">
        <DialogHeader className="h-auto">
          <DialogTitle>Full Screen</DialogTitle>
        </DialogHeader>
        <div className="flex-1 rounded-md overflow-hidden">
          <LeafletMap markers={markers} evacuationCenters={evacuationCenters} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
