"use client";
import React from "react";
import { useMessages } from "@/hooks/useMessages";
import ChatHeader from "./RightSide/ChatHeader";
import { ChatPlaceholder } from "./RightSide/ChatPlaceholder";
import { ChatContainer } from "./RightSide/ChatBubble";
import { ChatInput } from "./RightSide/ChatInput";

const RightSide = () => {
  const { messages, isLoading } = useMessages();

  if (!messages || isLoading || messages === undefined) {
    return <ChatPlaceholder />;
  }

  return (
    <div className="w-full h-screen flex flex-col border-r-2 border-card">
      <ChatHeader className="flex-shrink-0" />
      <div className="flex-grow overflow-y-auto">
        <ChatContainer />
      </div>
      <ChatInput className="flex-shrink-0" />
    </div>
  );
};

export default RightSide;
