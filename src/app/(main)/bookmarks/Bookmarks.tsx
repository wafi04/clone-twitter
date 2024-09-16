import { replies, UserData } from "@/lib/types";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import StatusPage from "@/components/features/status/StatusPage";
import UserTooltip from "@/components/ui/UserTooltip";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import { getTime, getTimeFromNow } from "@/lib/utils";
import Linkify from "@/components/ui/Linkify";
import { useRouter } from "next/navigation";
import { ButtonReplies } from "@/components/features/status/components/ButtonReplies";
import { DropdownRetweet } from "@/components/features/status/components/ButtonRetweetandQuote";
import { ButtonLike } from "@/components/features/status/components/ButtonLike";
import { ButtonBookmarks } from "@/components/features/status/components/ButtonBookmarks";

export type bookmarks = {
  creator: UserData;
  replies: replies;
  save: boolean;
  saver: Id<"users">;
  status: Id<"status">;
  _creationTime: number;
  _id: Id<"bookmarks">;
};

const Bookmarks = ({ bookmarks }: { bookmarks: bookmarks }) => {
  const { push } = useRouter();
  return (
    <div className="relative border-b border-neutral-800 ">
      <div className="flex items-start space-x-3 p-4 relative h-full">
        <div className="flex-shrink-0">
          <UserLinkWithTooltip
            username={bookmarks.replies.creator.name as string}
          >
            <UserAvatar avatarUrl={bookmarks.replies.creator.image} size={40} />
          </UserLinkWithTooltip>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-1">
            <UserLinkWithTooltip username={bookmarks.creator.name as string}>
              <p className="text-sm font-medium text-gray-200">
                {bookmarks.creator.name}
              </p>
            </UserLinkWithTooltip>
            <UserLinkWithTooltip username={bookmarks.creator.name as string}>
              <span className="text-sm text-gray-500">
                @{bookmarks.creator.name}
              </span>
            </UserLinkWithTooltip>

            <span className="text-sm text-gray-500">·</span>
            <span
              className="text-sm text-gray-500 hover:text-white cursor-pointer hover:font-bold"
              title={getTime(bookmarks._creationTime)}
            >
              {getTimeFromNow(bookmarks._creationTime)}
            </span>
          </div>
          <Linkify>
            <div
              onClick={() =>
                push(`/${bookmarks.creator.name}/bookmarks/${bookmarks._id}`)
              }
              className="whitespace-pre-wrap break-words w-full cursor-pointer"
            >
              {bookmarks.replies.content}
            </div>
          </Linkify>
          <div className="grid grid-cols-4 w-full mt-2">
            <ButtonReplies status={bookmarks.replies} />
            <DropdownRetweet status={bookmarks.replies} />
            <ButtonLike statusId={bookmarks.replies._id} />
            <ButtonBookmarks statusId={bookmarks.replies._id} />
          </div>
        </div>
        {/* {status.replies.length > 0 && (
      <div className="absolute h-full left-[24px] top-14 bottom-0 w-[2px] bg-neutral-700"></div>
    )} */}
      </div>
      {/* {status.replies.map((item) => (
    <StatusPage status={item} key={item._id} />
  ))} */}
    </div>
  );
};

export default Bookmarks;
