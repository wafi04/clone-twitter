"use client";
import React from "react";
import Image from "next/image";
import { useMessages } from "@/hooks/useMessages";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCreateConversations } from "@/hooks/useCreateConversations";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { conversation } from "../../types";
import { Id } from "../../../../../../convex/_generated/dataModel";
import UserAvatar from "@/components/ui/UserAvatar";

const ChatHeader = ({ className }: { className: string }) => {
  const { isGroup, participants, conversation } = useMessages();

  if (!participants || conversation === undefined) {
    return (
      <div className="w-full flex items-center p-4">
        {/* Skeleton Loader */}
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-card h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-card rounded w-3/4"></div>
            <div className="h-4 bg-card rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const conversationName = conversation?.isGroup
    ? conversation?.groupName
    : participants && participants[0].name;

  const conversationImage = conversation?.isGroup
    ? conversation?.groupImage
    : participants && participants[0].image;

  return (
    <div
      className={`${className} w-full flex items-center p-4   shadow-sm bg-card`}
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        {conversationImage && (
          <Image
            src={conversationImage}
            alt={conversationName}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        )}
      </div>
      <div className="ml-4">
        <h1 className="text-md font-semibold ">{conversationName}</h1>
        {conversation.isGroup && (
          <ToggleDialogMember conversation={conversation} />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

function ToggleDialogMember({ conversation }: { conversation: conversation }) {
  const { deleteMembers } = useCreateConversations();
  const { user: currentUserId } = useUser();
  const isCurrentUserAdmin = currentUserId?._id === conversation.admin;
  const handleDeleteMember = (memberId: Id<"users">) => {
    if (isCurrentUserAdmin && memberId !== conversation.admin) {
      deleteMembers({
        conversationId: conversation._id,
        userId: memberId,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="text-gray-400 text-sm">
        See Member
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-black">
        <h3>{conversation.groupName}</h3>
        {conversation.participants.map((conv) => {
          return (
            <div
              key={conv._id}
              className={`flex gap-2 p-3 items-center group hover:bg-card cursor-pointer rounded-md`}
            >
              <UserAvatar avatarUrl={conv.image} size={30} />
              <div className="w-full">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium">{conv.name}</h3>
                </div>
              </div>
              <div className="text-accent">
                {conv._id === conversation.admin ? (
                  <span className="text-sm">admin</span>
                ) : (
                  isCurrentUserAdmin && (
                    <Button
                      className="bg-transparent group-hover:text-white hover:bg-transparent"
                      onClick={() => handleDeleteMember(conv._id)}
                    >
                      <Ban />
                    </Button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}
