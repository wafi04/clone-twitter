"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEditMessages, useMessages } from "@/hooks/useMessages";
import Image from "next/image";
import EnhancedChatInput from "../@toggle/EnchandedInput";

export function ChatInput({ className }: { className: string }) {
  const { reply, edit, cancelEdit, cancelReply } = useEditMessages();
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessages();
  const [croppedImage, setCroppedImage] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (edit?.body) {
      setMessage(edit.body);
    }
  }, [edit]);

  const handleSendMessage = (text: string, image?: File) => {
    if (text.trim() || image) {
      sendMessage(text, image, edit?._id, reply?._id);
      setMessage("");
      cancelEdit();
      cancelReply();
      setCroppedImage(undefined);
    }
  };

  return (
    <div className={`${className} flex flex-col w-full relative`}>
      {croppedImage && (
        <div className="relative w-20 h-20 mb-2">
          <Image
            width={500}
            height={500}
            src={URL.createObjectURL(croppedImage)}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
          <Button
            onClick={() => setCroppedImage(undefined)}
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Showedit />
      <div className="flex w-full gap-3 items-center p-2 border-t">
        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          initialMessage={message}
          onMessageChange={setMessage}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
        />
      </div>
    </div>
  );
}

function Showedit() {
  const { reply, cancelReply } = useEditMessages();
  if (!reply) {
    return null;
  }
  return (
    <div className="border-t p-2">
      <div className="max-w-3xl mx-auto flex items-start space-x-2">
        <div className="flex-grow">
          <div className="text-sm text-gray-500 mb-1">Replying to</div>
          <div className="bg-card p-2 rounded-lg shadow-sm space-y-2">
            <div className="text-sm font-medium ">{reply.sender.name}</div>
            <div className="text-sm text-gray-300 line-clamp-2">
              {reply.body}
            </div>
            {reply.image && (
              <Image
                src={reply.image}
                alt="/"
                width={400}
                height={400}
                className="max-h-[200px] rounded-md object-cover"
              />
            )}
          </div>
        </div>
        <button
          onClick={cancelReply}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
