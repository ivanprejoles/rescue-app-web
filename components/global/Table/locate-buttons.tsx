"use client";

import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-full-screen";
import { useLocationStore } from "@/hooks/use-marker-location";
import { useMapStore } from "@/hooks/useMapStore";
import React from "react";

type Props = {
  id: string;
  userId?: string | null;
};

const LocateButton = ({ id, userId = null }: Props) => {
  const { setActiveMarkerId } = useMapStore();
  const { setOpen } = useDialogStore();
  const { setSelectedUserId } = useLocationStore();

  const onClickLocation = () => {
    setOpen(true);
    setActiveMarkerId(id);
    if (userId) {
      setSelectedUserId(userId);
    }
  };
  return (
    <Button
      className="cursor-pointer"
      variant="outline"
      onClick={onClickLocation}
    >
      Locate
    </Button>
  );
};

export default LocateButton;
