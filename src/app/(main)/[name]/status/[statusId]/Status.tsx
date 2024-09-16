"use client";

import React, { useCallback } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { StatusWithCreator } from "@/lib/types";
import UserAvatar from "@/components/ui/UserAvatar";
import UserTooltip from "@/components/ui/UserTooltip";
import Link from "next/link";
import { getTime, getTimeFromNow } from "@/lib/utils";
import Linkify from "@/components/ui/Linkify";
import { useRouter } from "next/navigation";
import { ButtonReplies } from "@/components/features/status/components/ButtonReplies";
import { DropdownRetweet } from "@/components/features/status/components/ButtonRetweetandQuote";
import { ButtonLike } from "@/components/features/status/components/ButtonLike";
import { ButtonBookmarks } from "@/components/features/status/components/ButtonBookmarks";
import { useStatus } from "@/hooks/useStatus";
import StatusEditor from "@/components/features/status/editor";
import useStatusThread from "@/hooks/useStatusThread";
import { Loader2 } from "lucide-react";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";

const Status = ({ statusId }: { statusId: Id<"status"> }) => {
  const { childStatuses, parentStatuses, statusThread, targetStatus } =
    useStatusThread(statusId);
  const { onSubmit, toast } = useStatus();

  const handleSubmit = useCallback(
    async (content: string, image: File | null) => {
      try {
        await onSubmit(content, image, statusId);
      } catch (error) {
        toast({
          description: "Failed to submit reply",
        });
        return;
      }
    },
    [onSubmit, toast, statusId]
  );
  if (!statusThread) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-500 size-10" />
      </div>
    );
  }
  return (
    <>
      {parentStatuses.map((status) => (
        <StatusCard key={status._id} status={status} />
      ))}
      {targetStatus && <StatusCard status={targetStatus} isMain={true} />}
      <StatusEditor onSubmit={handleSubmit} placeholder="Reply..." />
      {targetStatus &&
        targetStatus.children &&
        targetStatus.children.length > 0 && (
          <div className=" border-t ">
            {targetStatus.children.map((childStatus) => (
              <StatusCard key={childStatus._id} status={childStatus} />
            ))}
          </div>
        )}
      {childStatuses.map((status) => (
        <StatusCard key={status._id} status={status} />
      ))}
    </>
  );
};

const StatusCard: React.FC<{ status: StatusWithCreator; isMain?: boolean }> = ({
  status,
  isMain = false,
}) => {
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
                @{status.creator.email?.split("@")[0]}
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
          <div className="grid grid-cols-4 w-full mt-2">
            <ButtonReplies status={status} />
            <DropdownRetweet status={status} />
            <ButtonLike statusId={status._id} />
            <ButtonBookmarks statusId={status._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
