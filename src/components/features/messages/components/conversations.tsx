import React from "react";
import { useMessages } from "@/hooks/useMessages";
import { conversationType } from "../types";
import UserAvatar from "@/components/ui/UserAvatar";
import { formatDate } from "date-fns";
import { MessagesType } from "./MessageType";
import { getTimeFromNow } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

const Conversations = ({ conv }: { conv: conversationType }) => {
  const {
    _creationTime,
    _id,
    isGroup,
    lastMessage,
    groupImage,
    groupName,
    name,
    image,
  } = conv;
  const conversationName = isGroup ? groupName : name;
  const { loadMessagesForConversation } = useMessages();
  const dataCount = useQuery(api.messages.getAllMessagesUnread, {
    conversationId: conv._id,
  });
  return (
    <div
      onClick={() => loadMessagesForConversation(_id)}
      className={`flex gap-2 p-3 items-center relative hover:bg-card cursor-pointer`}
    >
      {dataCount && (
        <Button className="absolute text-xs top-2 left-8 bg-twitter text-white hover:bg-twitter h-4 w-4 p-0 rounded-full ">
          {dataCount.count.length}
        </Button>
      )}
      <UserAvatar avatarUrl={isGroup ? groupImage : image} size={30} />
      <div className="w-full">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">{conversationName}</h3>
          <span className="text-xs text-gray-500 ml-auto">
            {getTimeFromNow(lastMessage?._creationTime || _creationTime)}
          </span>
        </div>
        <MessagesType message={lastMessage} isGroup={conv.isGroup} />
      </div>
    </div>
  );
};

export default Conversations;
