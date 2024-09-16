"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useMessages } from "@/hooks/useMessages";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import { getTime } from "@/lib/utils";
import { DrodpdownMessages } from "../@toggle/DropdownMessages";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

interface ChatBubbleProps {
  children: React.ReactNode;
  isCurrentUser: boolean;
  timestamp: string;
  isReply?: boolean;
  messageId: Id<"messages">;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  children,
  isCurrentUser,
  timestamp,
  isReply,
  messageId,
}) => {
  return (
    <div
      className={`flex relative group ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`rounded-lg p-3 max-w-[70%] ${
          isCurrentUser ? "bg-blue-600" : "bg-gray-700"
        } ${isReply ? "border-l-4 border-green-400" : ""}`}
      >
        {children}
        <div className="text-xs mt-1 text-gray-300">{timestamp}</div>
      </div>
    </div>
  );
};

export function ChatContainer() {
  const { messages, loadMore, isLoading, conversationId } = useMessages();
  const { user } = useUser();
  const updatemessages = useMutation(api.messages.updateMessagesInConversation);
  const { toast } = useToast();
  useEffect(() => {
    if (conversationId) {
      const markNotificationsAsRead = async () => {
        try {
          await updatemessages({
            conversationId,
          });
        } catch (error) {
          toast({ description: "Failed to update notification status" });
        }
      };

      markNotificationsAsRead();
    }
  }, [messages, updatemessages, toast, conversationId]);

  return (
    <InfiniteScrollContainer
      onBottomReached={() => loadMore(3)}
      number={3}
      className="h-full w-full space-y-4 flex flex-col px-4 py-2"
    >
      {messages.map((message) => {
        const isCurrentUser = message.sender._id === user?._id;
        const isReply = !!message.parrentMessages?.body;

        return (
          <ChatBubble
            key={message._id}
            isCurrentUser={isCurrentUser}
            messageId={message._id}
            timestamp={getTime(message._creationTime)}
            isReply={isReply}
          >
            <div className="flex flex-col">
              {!isCurrentUser && !isReply && (
                <p className="text-sm font-semibold mb-1 text-gray-300">
                  {message.sender.displayName}
                </p>
              )}
              {isReply && (
                <div className="text-xs italic mb-1 text-gray-400">
                  {isCurrentUser ? "You replied to:" : "Replying to:"}
                </div>
              )}
              {message.parrentMessages?.body && (
                <div className="text-sm italic mb-2 text-gray-400">
                  {message.parrentMessages.body}
                </div>
              )}
              <div className="text-sm break-words">
                {message.body}
                <DrodpdownMessages message={message} isSender={isCurrentUser} />
              </div>
              {message.image && (
                <Image
                  src={message.image}
                  alt="Message image"
                  width={200}
                  height={200}
                  className="mt-2 rounded-lg"
                />
              )}
            </div>
          </ChatBubble>
        );
      })}
      {isLoading && <Loader2 className="animate-spin" />}
    </InfiniteScrollContainer>
  );
}
