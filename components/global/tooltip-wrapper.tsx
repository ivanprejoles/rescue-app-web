import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { truncateText } from "@/lib/utils";
import useMediaQuery from "@/lib/media-query";
import { Button } from "../ui/button";

interface WrapperProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TooltipWrapper = ({ text, maxLength = 15, className }: WrapperProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const truncatedText = truncateText(text, isMobile ? 10 : maxLength);
  const showFullText = text.length > (isMobile ? 10 : maxLength);

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className={`h-auto p-0 text-left ${className} w-auto`}
          >
            {truncatedText}
            {showFullText && (
              <span className="text-muted-foreground"> ...</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`sm:max-w-[500px] text-xs md:text-sm px-2 ${className}`}
        >
          <DialogTitle>{text}</DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>
            {truncatedText}
            {showFullText && <span className="text-muted-foreground">...</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className={`max-auto bg-muted text-muted-foreground px-3 py-2 rounded-md shadow-lg ${className}`}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
