"use client";

import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-full-screen";
import { useMapStore } from "@/hooks/useMapStore";
import React from "react";

type Props = {
  id: string;
};

const LocateButton = ({ id }: Props) => {
  const { setActiveMarkerId } = useMapStore();
  const { setOpen } = useDialogStore();

  const onClickLocation = () => {
    setOpen(true);
    setActiveMarkerId(id);
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
