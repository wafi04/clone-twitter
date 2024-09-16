"use client";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useStatus } from "@/hooks/useStatus";
import StatusEditor from "../features/status/editor";

const DialogStatus = () => {
  const { onSubmit, toast } = useStatus();
  const handleSubmit = async (content: string, image: File | null) => {
    try {
      await onSubmit(content, image);
    } catch (error) {
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full mt-6   rounded-full py-3 lg:py-4"
          variant={"twitter"}
        >
          <span className="hidden lg:inline">Tweet</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 lg:hidden fill-current">
            <g>
              <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z"></path>
            </g>
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 rounded-full">
        <StatusEditor onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogStatus;
