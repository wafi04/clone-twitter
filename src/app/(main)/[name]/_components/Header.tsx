"use client";
import Navbar from "@/components/ui/Navbar";
import React from "react";
import { getTabClassName } from "../(follow)/components/Utils";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import StatusPage from "@/components/features/status/StatusPage";
import {
  StatusWithCreator,
  StatusWithCreatorAndChildren,
  StatusWithUsersandReplies,
} from "@/lib/types";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import { getTime, getTimeFromNow } from "@/lib/utils";
import Linkify from "@/components/ui/Linkify";
import { ButtonReplies } from "@/components/features/status/components/ButtonReplies";
import { DropdownRetweet } from "@/components/features/status/components/ButtonRetweetandQuote";
import { ButtonLike } from "@/components/features/status/components/ButtonLike";
import { ButtonBookmarks } from "@/components/features/status/components/ButtonBookmarks";
import { Loader2 } from "lucide-react";

const Header = ({ name }: { name: string }) => {
  const baseUrl = `/${name}`;
  const router = useRouter();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className="border-y-2 w-full flex justify-between gap-2">
        <button
          className={`${getTabClassName(`${baseUrl}`)}  `}
          onClick={() => handleTabClick(`${baseUrl}/`)}
        >
          All
        </button>
        <button
          className={getTabClassName(`${baseUrl}/like`)}
          onClick={() => handleTabClick(`${baseUrl}/like`)}
        >
          Like
        </button>
        <button
          className={getTabClassName(`${baseUrl}/retweet`)}
          onClick={() => handleTabClick(`${baseUrl}/retweet`)}
        >
          Retweet
        </button>
        <button
          className={getTabClassName(`${baseUrl}/quote`)}
          onClick={() => handleTabClick(`${baseUrl}/quote`)}
        >
          Quote
        </button>
      </div>
    </>
  );
};

export default Header;

export function GetAllData({ name }: { name: string }) {
  const { loadMore, isLoading, results, status } = usePaginatedQuery(
    api.status.getAllStatusByUser,
    {
      name,
    },
    {
      initialNumItems: 5,
    }
  );

  if (!results || results === undefined) {
    return null;
  }

  return (
    <>
      {status && (
        <>
          <Header name={name} />
          <InfiniteScrollContainer
            onBottomReached={() => loadMore(5)}
            number={5}
          >
            {results.map((status) => (
              <Status status={status} key={status?._id} />
            ))}
            {status === "LoadingMore" && (
              <Loader2 className="animate-spin text-blue-500" />
            )}
            {status === "Exhausted" && undefined}
          </InfiniteScrollContainer>
        </>
      )}
    </>
  );
}

export function Status({ status }: { status: StatusWithUsersandReplies }) {
  const { push } = useRouter();
  return (
    <div className="relative border-b border-neutral-800 ">
      <div className="flex items-start space-x-3 p-4 relative h-full">
        <div className="flex-shrink-0">
          <UserLinkWithTooltip username={status.creator?.name as string}>
            <UserAvatar avatarUrl={status.creator.image} size={40} />
          </UserLinkWithTooltip>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-1">
            <UserLinkWithTooltip username={status.creator?.name as string}>
              <p className="text-sm font-medium text-gray-200">
                {status.creator.name}
              </p>
            </UserLinkWithTooltip>

            <UserLinkWithTooltip username={status.creator?.name as string}>
              <span className="text-sm text-gray-500">
                @{status.creator.displayName || status.creator.name}
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
        {status.replies && (
          <div className="absolute h-full left-[24px] top-14 bottom-0 w-[2px] bg-neutral-700"></div>
        )}
      </div>
      {status.replies && <Status status={status.replies} />}
    </div>
  );
}
