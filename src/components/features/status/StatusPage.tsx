import React, { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { getTime, getTimeFromNow } from "@/lib/utils";
import Linkify from "@/components/ui/Linkify";
import { useRouter } from "next/navigation";
import UserTooltip from "@/components/ui/UserTooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import Link from "next/link";
import { ButtonReplies } from "./components/ButtonReplies";
import { CommentWithReplies } from "@/lib/types";
import { ButtonLike } from "./components/ButtonLike";
import { DropdownRetweet } from "./components/ButtonRetweetandQuote";
import { ButtonBookmarks } from "./components/ButtonBookmarks";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import MediaGrid from "@/components/ui/MediaPost";

const StatusPage = ({ status }: { status: CommentWithReplies }) => {
  if (!status.creator) {
    return null;
  }

  const { push } = useRouter();

  return (
    <div className="relative border-b border-neutral-800 ">
      <div className="flex items-start space-x-3 p-4 relative h-full">
        <div className="flex-shrink-0">
          <UserLinkWithTooltip username={status.creator.name as string}>
            <UserAvatar avatarUrl={status.creator.image} size={40} />
          </UserLinkWithTooltip>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-1">
            <UserLinkWithTooltip username={status.creator.name as string}>
              <p className="text-sm font-medium text-gray-200">
                {status.creator.name}
              </p>
            </UserLinkWithTooltip>
            <UserLinkWithTooltip username={status.creator.name as string}>
              <span className="text-sm text-gray-500">
                @{status.creator.name}
              </span>
            </UserLinkWithTooltip>

            <span className="text-sm text-gray-500">·</span>
            <span
              className="text-sm text-gray-500 hover:text-white cursor-pointer hover:font-bold"
              title={getTime(status._creationTime)}
            >
              {getTimeFromNow(status._creationTime)}
            </span>
          </div>
          <Linkify>
            <div
              onClick={() =>
                push(`/${status.creator.name}/status/${status._id}`)
              }
              className="whitespace-pre-wrap break-words w-full cursor-pointer"
            >
              {status.content}
            </div>
          </Linkify>
          <MediaGrid statusId={status._id} />
          <div className="grid grid-cols-4 w-full mt-2">
            <ButtonReplies status={status} />
            <DropdownRetweet status={status} />
            <ButtonLike statusId={status._id} />
            <ButtonBookmarks statusId={status._id} />
          </div>
        </div>
        {status.replies.length > 0 && (
          <div className="absolute h-full left-[24px] top-14 bottom-0 w-[2px] bg-neutral-700"></div>
        )}
      </div>
      {status.replies.map((item) => (
        <StatusPage status={item} key={item._id} />
      ))}
    </div>
  );
};

export default StatusPage;
