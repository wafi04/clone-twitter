import React from "react";
import { ImageIcon, Users } from "lucide-react";
import { Messages, MessagesConv } from "../types";

interface MessagesTypeProps {
  message?: MessagesConv | null;
  isGroup: boolean;
}

export function MessagesType({ message, isGroup }: MessagesTypeProps) {
  return (
    <p className="text-xs mt-1 text-gray-500 flex items-center justify-between">
      <span className="flex items-center gap-2">
        {isGroup && <Users size={16} />}
        {!message && "Say Hi!"}
        {message && (
          <>
            <span>
              {message.body.length > 30
                ? `${message.body.slice(0, 30)}...`
                : message.body}
            </span>
            {message.image === "image" && <ImageIcon size={16} />}
          </>
        )}
      </span>
    </p>
  );
}
